package service

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/SamixDev/seek/model"
	. "github.com/bjartek/overflow"
	"go.uber.org/zap"
	"gorm.io/datatypes"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type fetchedFollow []struct {
	Name        string    `json:"name"`
	BlockHeight int       `json:"blockHeight"`
	Time        time.Time `json:"time"`
	Event       struct {
		Fields struct {
			Follower  string   `json:"follower"`
			Following string   `json:"following"`
			Tags      []string `json:"tags"`
		} `json:"fields"`
		TransactionID string `json:"transactionID"`
		Name          string `json:"name"`
	} `json:"event"`
}

// cron job to sync follows
func (s *Service) SyncFollowsCron(ctx context.Context) {
	for {
		for {
			var startingIndex uint64
			var endingIndex uint64
			// get last indexed block
			var offset model.Offset
			start := s.dbClient.Where("event_type = ?", "follow").First(&offset)
			if start.Error != nil && start.Error != gorm.ErrRecordNotFound {
				zap.L().Error("SyncFollowsCron", zap.String("error", fmt.Sprintf("%+v", start.Error)))
				return
			} else if start.RowsAffected == 0 && start.Error == gorm.ErrRecordNotFound {
				startingIndex = 46668325
			} else {
				startingIndex = offset.BlockHeight
			}
			startingIndex = startingIndex + 1
			block, err := s.flowClient.GetLatestBlock()
			if err != nil {
				zap.L().
					Error("SyncFollowsCron fetch events", zap.String("error", fmt.Sprintf("%+v", err)))
				break
			}

			if startingIndex+1000 > block.Height-10 {
				endingIndex = block.Height - 10
			} else {
				endingIndex = startingIndex + 1000
			}

			events, err := s.flowClient.FetchEvents(
				//WithLastBlocks(1000),
				WithStartHeight(int64(startingIndex)),
				WithUntilBlock(uint64(endingIndex)),
				WithEvent("A.097bafa4e0b48eef.Profile.Follow"),
			)
			if err != nil {
				zap.L().
					Error("SyncFollowsCron fetch events", zap.String("error", fmt.Sprintf("%+v", err)))
				break
			}
			if len(events) != 0 {
				s.dbClient.Transaction(func(tx *gorm.DB) error {
					// do some database operations in the transaction (use 'tx' from this point, not 'db')
					maxBlockHeight := 0
					for _, event := range events {
						var follow model.Follow

						follow.Follower = event.Event.Fields["follower"].(string)
						follow.Following = event.Event.Fields["following"].(string)
						follow.CreationDate = event.Time
						follow.BlockHeight = uint64(event.BlockHeight)
						tags := map[string][]string{"tags": {}}
						if event.Event.Fields["tags"] != nil {
							for _, tag := range event.Event.Fields["tags"].([]interface{}) {
								tags["tags"] = append(tags["tags"], tag.(string))
							}
							j, err := json.Marshal(tags)
							if err != nil {
								fmt.Printf("Error: %s", err.Error())
							} else {
								follow.Tags = datatypes.JSON([]byte(string(j)))
							}
						} else {
							follow.Tags = datatypes.JSON([]byte("{}"))
						}

						if int(event.BlockHeight) > maxBlockHeight {
							maxBlockHeight = int(event.BlockHeight)
						}

						err := tx.Clauses(clause.OnConflict{
							Columns:   []clause.Column{{Name: "follower"}, {Name: "following"}},
							DoUpdates: clause.AssignmentColumns([]string{"tags", "block_height", "creation_date"}),
						}).Create(&follow)
						if err.Error != nil {
							break
						}
					}
					var offset model.Offset
					offset.EventType = "follow"
					offset.BlockHeight = uint64(maxBlockHeight)
					tx.Clauses(clause.OnConflict{
						Columns:   []clause.Column{{Name: "event_type"}},
						DoUpdates: clause.AssignmentColumns([]string{"block_height"}),
					}).Create(&offset)
					// return nil will commit the whole transaction
					return nil
				})
			} else {
				var offset model.Offset
				offset.EventType = "follow"
				offset.BlockHeight = uint64(endingIndex)
				s.dbClient.Clauses(clause.OnConflict{
					Columns:   []clause.Column{{Name: "event_type"}},
					DoUpdates: clause.AssignmentColumns([]string{"block_height"}),
				}).Create(&offset)
			}

			time.Sleep(10 * time.Second)
		}
		time.Sleep(10 * time.Second)
	}
}

// cron job to sync unfollows
func (s *Service) SyncUnollowsCron(ctx context.Context) {
	for {
		var startIndexing bool
		// get last indexed block for follows
		var offsetFollow model.Offset
		start := s.dbClient.Where("event_type = ?", "follow").First(&offsetFollow)
		if start.Error != nil && start.Error != gorm.ErrRecordNotFound {
			zap.L().Error("SyncUnollowsCron fetch events", zap.String("error", fmt.Sprintf("%+v", start.Error)))
			return
		} else if start.RowsAffected == 0 && start.Error == gorm.ErrRecordNotFound {
			startIndexing = false
		} else {
			startIndexing = true
		}

		for {
			if startIndexing == false {
				break
			}
			var startingIndex uint64
			var endingIndex uint64
			// get last indexed block for unfollows
			var offsetUnfollow model.Offset
			start = s.dbClient.Where("event_type = ?", "unfollow").First(&offsetUnfollow)
			if start.Error != nil && start.Error != gorm.ErrRecordNotFound {
				zap.L().Error("SyncUnollowsCron fetch events", zap.String("error", fmt.Sprintf("%+v", start.Error)))
				return
			} else if start.RowsAffected == 0 && start.Error == gorm.ErrRecordNotFound {
				startingIndex = 46668325
			} else {
				startingIndex = offsetUnfollow.BlockHeight
			}
			startingIndex = startingIndex + 1

			if startingIndex >= offsetFollow.BlockHeight {
				break
			} else if startingIndex+1000 >= offsetFollow.BlockHeight {
				endingIndex = offsetFollow.BlockHeight
			} else {
				endingIndex = startingIndex + 1000
			}

			events, err := s.flowClient.FetchEvents(
				//WithLastBlocks(1000),
				WithStartHeight(int64(startingIndex)),
				WithUntilBlock(endingIndex),
				WithEvent("A.097bafa4e0b48eef.Profile.Unfollow"),
			)
			if err != nil {
				zap.L().
					Error("SyncUnollowsCron fetch events", zap.String("error", fmt.Sprintf("%+v", err)))
				break
			}
			if len(events) != 0 {
				s.dbClient.Transaction(func(tx *gorm.DB) error {
					// do some database operations in the transaction (use 'tx' from this point, not 'db')
					maxBlockHeight := 0
					for _, event := range events {
						var follow model.Follow

						if int(event.BlockHeight) > maxBlockHeight {
							maxBlockHeight = int(event.BlockHeight)
						}

						err := tx.Where("follower = ? AND following = ? AND block_height < ?", event.Event.Fields["follower"].(string), event.Event.Fields["unfollowing"].(string), event.BlockHeight).Delete(&follow)
						if err.Error != nil {
							break
						}
					}
					var offset model.Offset
					offset.EventType = "unfollow"
					offset.BlockHeight = uint64(maxBlockHeight)
					tx.Clauses(clause.OnConflict{
						Columns:   []clause.Column{{Name: "event_type"}},
						DoUpdates: clause.AssignmentColumns([]string{"block_height"}),
					}).Create(&offset)
					// return nil will commit the whole transaction
					return nil
				})
			} else {
				var offset model.Offset
				offset.EventType = "unfollow"
				offset.BlockHeight = uint64(endingIndex)
				s.dbClient.Clauses(clause.OnConflict{
					Columns:   []clause.Column{{Name: "event_type"}},
					DoUpdates: clause.AssignmentColumns([]string{"block_height"}),
				}).Create(&offset)
			}

			time.Sleep(10 * time.Second)
		}
		time.Sleep(10 * time.Second)
	}
}
