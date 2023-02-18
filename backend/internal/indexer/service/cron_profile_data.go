package service

import (
	"context"
	"fmt"
	"time"

	"github.com/SamixDev/seek/model"
	. "github.com/bjartek/overflow"
	"go.uber.org/zap"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

// cron job to sync assets
func (s *Service) SyncProfilesCreatedCron(ctx context.Context) {

	for {
		var startIndexing bool

		// check if historical data is indexed
		var historical []model.Historical
		hist := s.dbClient.Select("type", "indexed").Where("type IN ? AND indexed = ?", []string{"profile_created", "profile_updated"}, true).Find(&historical)
		if hist.Error != nil || hist.RowsAffected < 2 {
			startIndexing = false
		} else {
			startIndexing = true
		}

		for {
			if startIndexing == false {
				break
			}
			var startingIndex int64
			// get last indexed block
			var offset model.Offset
			start := s.dbClient.Where("event_type = ?", "profile_created").First(&offset)
			if start.Error != nil && start.Error != gorm.ErrRecordNotFound {
				zap.L().Error("SyncProfilesCron fetch events", zap.String("error", fmt.Sprintf("%+v", start.Error)))
				return
			} else if start.RowsAffected == 0 && start.Error == gorm.ErrRecordNotFound {
				startingIndex = 46531759
			} else {
				startingIndex = int64(offset.BlockHeight)
			}

			fmt.Println("starting index", startingIndex)
			startingIndex = startingIndex + 1

			events, err := s.flowClient.FetchEvents(
				//WithLastBlocks(1000),
				WithStartHeight(startingIndex),
				//	WithUntilBlock(uint64(startingIndex)+10000),
				WithEvent("A.097bafa4e0b48eef.Profile.Created"),
			)
			if err != nil {
				zap.L().
					Error("SyncProfilesCron fetch events", zap.String("error", fmt.Sprintf("%+v", err)))
				break
			}

			if len(events) == 0 {
				fmt.Println("no new profile created events")
				break
			} else {
				fmt.Println("total events", len(events))

				s.dbClient.Transaction(func(tx *gorm.DB) error {
					// do some database operations in the transaction (use 'tx' from this point, not 'db')
					maxBlockHeight := 0
					for _, event := range events {
						var profile model.Profile
						if event.Event.Fields["account"] != nil {
							profile.Address = event.Event.Fields["account"].(string)
						}
						if event.Event.Fields["userName"] != nil {
							profile.UserName = event.Event.Fields["userName"].(string)
						}
						if event.Event.Fields["findName"] != nil {
							profile.FindName = event.Event.Fields["findName"].(string)
						}
						if event.Event.Fields["createdAt"] != nil {
							profile.Platform = event.Event.Fields["createdAt"].(string)
						}
						profile.Thumbnail = ""
						profile.CreationDate = event.Time

						if int(event.BlockHeight) > maxBlockHeight {
							maxBlockHeight = int(event.BlockHeight)
						}

						tx.Clauses(clause.OnConflict{
							Columns:   []clause.Column{{Name: "address"}},
							DoUpdates: clause.AssignmentColumns([]string{"user_name", "find_name", "platform", "thumbnail", "creation_date"}),
						}).Create(&profile)
					}
					var offset model.Offset
					offset.EventType = "profile"
					offset.BlockHeight = uint64(maxBlockHeight)
					tx.Clauses(clause.OnConflict{
						Columns:   []clause.Column{{Name: "event_type"}},
						DoUpdates: clause.AssignmentColumns([]string{"block_height"}),
					}).Create(&offset)
					// return nil will commit the whole transaction
					return nil
				})
			}
			time.Sleep(10 * time.Second)
		}
		time.Sleep(60 * time.Second)
	}
}
