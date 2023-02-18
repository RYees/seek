package service

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"time"

	"github.com/SamixDev/seek/model"
	"go.uber.org/zap"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type fetchedProfiles []struct {
	ID             string `json:"id"`
	BlockEventData struct {
		Account   string `json:"account"`
		UserName  string `json:"userName"`
		FindName  string `json:"findName"`
		CreatedAt string `json:"createdAt"`
		Thumbnail string `json:"thumbnail"`
	} `json:"blockEventData"`
	EventDate         time.Time `json:"eventDate"`
	FlowEventID       string    `json:"flowEventId"`
	BlockHeight       int       `json:"blockHeight"`
	FlowTransactionID string    `json:"flowTransactionId"`
}

// cron job to sync old profiles created
func (s *Service) SyncOldProfilesCreatedCron(ctx context.Context) {

	for {
		var startIndexing bool
		pageNumber := 1
		var historical model.Historical
		start := s.dbClient.Where("type = ?", "profile_created").First(&historical)
		if start.Error != nil && start.Error != gorm.ErrRecordNotFound {
			zap.L().Error("SyncOldProfilesCreatedCron fetch events", zap.String("error", fmt.Sprintf("%+v", start.Error)))
		} else if start.RowsAffected == 0 && start.Error == gorm.ErrRecordNotFound {
			startIndexing = true
			newHistorical := model.Historical{Type: "profile_created", Indexed: false}
			s.dbClient.Create(&newHistorical)
		} else if historical.Indexed == false {
			startIndexing = true
		} else {
			startIndexing = false
		}
		for {
			if startIndexing == false {
				break
			}
			fmt.Println("starting indexing old profiles")
			fmt.Println("page number", pageNumber)
			url := fmt.Sprintf("https://prod-main-net-dashboard-api.azurewebsites.net/api/company/04bd44ea-0ff1-44be-a5a0-e502802c56d8/search?eventType=A.097bafa4e0b48eef.Profile.Created&pageSize=%d&page=%d", 15000, pageNumber)
			fetchData, err := s.httpClient.Get(url)
			if err != nil {
				fmt.Println("error fetching data", err)
				break
			}
			b, _ := io.ReadAll(fetchData.Body)
			var res fetchedProfiles
			json.Unmarshal(b, &res)
			if len(res) == 0 {
				fmt.Println("No more data")
				s.dbClient.Model(&model.Historical{}).Where("type = ?", "profile_created").Update("indexed", true)
				pageNumber = 1
				break
			} else {
				fmt.Println("total events", len(res))

				s.dbClient.Transaction(func(tx *gorm.DB) error {
					maxBlockHeight := 0
					// do some database operations in the transaction (use 'tx' from this point, not 'db')
					for _, event := range res {
						var profile model.Profile
						profile.Address = event.BlockEventData.Account
						profile.UserName = event.BlockEventData.UserName
						profile.FindName = event.BlockEventData.FindName
						profile.Platform = event.BlockEventData.CreatedAt
						profile.Thumbnail = ""
						profile.CreationDate = event.EventDate

						if int(event.BlockHeight) > maxBlockHeight {
							maxBlockHeight = int(event.BlockHeight)
						}

						tx.Clauses(clause.OnConflict{
							Columns:   []clause.Column{{Name: "address"}},
							DoUpdates: clause.AssignmentColumns([]string{"user_name", "find_name", "platform", "thumbnail", "creation_date"}),
						}).Create(&profile)
					}
					var offset model.Offset
					offset.EventType = "profile_created"
					offset.BlockHeight = uint64(maxBlockHeight)
					tx.Clauses(clause.OnConflict{
						Columns:   []clause.Column{{Name: "event_type"}},
						DoUpdates: clause.AssignmentColumns([]string{"block_height"}),
					}).Create(&offset)
					// return nil will commit the whole transaction
					return nil
				})

				pageNumber = pageNumber + 1
			}
			time.Sleep(10 * time.Second)
		}
		time.Sleep(60 * 60 * time.Second)
	}
}

// cron job to sync old profiles updated
func (s *Service) SyncOldProfilesUpdatedCron(ctx context.Context) {

	for {
		var startIndexing bool
		pageNumber := 1
		var historical model.Historical
		start := s.dbClient.Where("type = ?", "profile_updated").First(&historical)
		var historicalCreated model.Historical
		startCreated := s.dbClient.Where("type = ?", "profile_created").First(&historicalCreated)
		if startCreated.Error != nil && startCreated.Error != gorm.ErrRecordNotFound {
			startIndexing = false
			zap.L().Error("SyncOldProfilesUpdatedCron fetch events", zap.String("error", fmt.Sprintf("%+v", startCreated.Error)))
		} else {
			if historicalCreated.Indexed == false {
				startIndexing = false
			} else {
				var offset model.Offset
				before := s.dbClient.Where("event_type = ?", "profile_created").First(&offset)
				if before.Error != nil && before.Error != gorm.ErrRecordNotFound && start.Error != nil && start.Error != gorm.ErrRecordNotFound {
					zap.L().Error("SyncOldProfilesUpdatedCron fetch events", zap.String("error", fmt.Sprintf("%+v", before.Error)))
				} else if before.RowsAffected == 0 && before.Error == gorm.ErrRecordNotFound {
					startIndexing = false
				} else {
					if start.RowsAffected == 0 && start.Error == gorm.ErrRecordNotFound {
						newHistorical := model.Historical{Type: "profile_updated", Indexed: false}
						s.dbClient.Create(&newHistorical)
						startIndexing = true
					} else if historical.Indexed == false {
						startIndexing = true
					} else {
						startIndexing = false
					}
				}
			}
		}

		for {
			if startIndexing == false {
				break
			}
			fmt.Println("starting indexing old profiles updated")
			fmt.Println("page number", pageNumber)
			url := fmt.Sprintf("https://prod-main-net-dashboard-api.azurewebsites.net/api/company/04bd44ea-0ff1-44be-a5a0-e502802c56d8/search?eventType=A.097bafa4e0b48eef.Profile.Updated&pageSize=%d&page=%d", 15000, pageNumber)
			fetchData, err := s.httpClient.Get(url)
			if err != nil {
				fmt.Println("error fetching data", err)
				break
			}
			b, _ := io.ReadAll(fetchData.Body)
			var res fetchedProfiles
			json.Unmarshal(b, &res)
			if len(res) == 0 {
				fmt.Println("No more data")
				s.dbClient.Model(&model.Historical{}).Where("type = ?", "profile_updated").Update("indexed", true)
				pageNumber = 1
				break
			} else {
				fmt.Println("total events", len(res))

				s.dbClient.Transaction(func(tx *gorm.DB) error {
					maxBlockHeight := 0
					// do some database operations in the transaction (use 'tx' from this point, not 'db')
					for _, event := range res {
						var profile model.Profile
						profile.Address = event.BlockEventData.Account
						profile.UserName = event.BlockEventData.UserName
						profile.FindName = event.BlockEventData.FindName
						profile.Platform = event.BlockEventData.CreatedAt
						profile.Thumbnail = event.BlockEventData.Thumbnail
						profile.CreationDate = event.EventDate

						if int(event.BlockHeight) > maxBlockHeight {
							maxBlockHeight = int(event.BlockHeight)
						}

						tx.Clauses(clause.OnConflict{
							Columns:   []clause.Column{{Name: "address"}},
							DoUpdates: clause.AssignmentColumns([]string{"user_name", "find_name", "platform", "thumbnail", "creation_date"}),
						}).Create(&profile)
					}
					var offset model.Offset
					offset.EventType = "profile_updated"
					offset.BlockHeight = uint64(maxBlockHeight)
					tx.Clauses(clause.OnConflict{
						Columns:   []clause.Column{{Name: "event_type"}},
						DoUpdates: clause.AssignmentColumns([]string{"block_height"}),
					}).Create(&offset)
					// return nil will commit the whole transaction
					return nil
				})

				pageNumber = pageNumber + 1
			}
			time.Sleep(10 * time.Second)
		}
		time.Sleep(60 * 60 * time.Second)
	}
}
