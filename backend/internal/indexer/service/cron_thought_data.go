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

type fetchedThoughts []struct {
	ID             string `json:"id"`
	BlockEventData struct {
		ID          int           `json:"id"`
		Creator     string        `json:"creator"`
		CreatorName interface{}   `json:"creatorName"`
		Header      string        `json:"header"`
		Message     string        `json:"message"`
		Medias      []interface{} `json:"medias"`
		Nfts        []interface{} `json:"nfts"`
		Tags        []interface{} `json:"tags"`
		QuoteOwner  interface{}   `json:"quoteOwner"`
		QuoteID     interface{}   `json:"quoteId"`
	} `json:"blockEventData"`
	EventDate         time.Time `json:"eventDate"`
	FlowEventID       string    `json:"flowEventId"`
	BlockHeight       int       `json:"blockHeight"`
	FlowTransactionID string    `json:"flowTransactionId"`
}

// cron job to sync thoughts published
func (s *Service) SyncThoughtsPublishedCron(ctx context.Context) {

	for {
		// var startIndexing bool
		// var historical model.Historical
		// start := s.dbClient.Where("type = ?", "thought_published").First(&historical)
		// if start.Error != nil && start.Error != gorm.ErrRecordNotFound {
		// 	zap.L().Error("SyncOldThoughtsPublishedCron fetch events", zap.String("error", fmt.Sprintf("%+v", start.Error)))
		// } else if start.RowsAffected == 0 && start.Error == gorm.ErrRecordNotFound {
		// 	startIndexing = true
		// 	newHistorical := model.Historical{Type: "thought_published", Indexed: false}
		// 	s.dbClient.Create(&newHistorical)
		// } else if historical.Indexed == false {
		// 	startIndexing = true
		// } else {
		// 	startIndexing = false
		// }
		for {
			// if startIndexing == false {
			// 	break
			// }
			var startUnixDate uint64
			var offset model.Offset
			start := s.dbClient.Where("event_type = ?", "thought_published").First(&offset)
			if start.Error != nil && start.Error != gorm.ErrRecordNotFound {
				zap.L().Error("SyncThoughtsPublishedCron fetch events", zap.String("error", fmt.Sprintf("%+v", start.Error)))
				return
			} else if start.RowsAffected == 0 && start.Error == gorm.ErrRecordNotFound {
				startUnixDate = 0
			} else {
				startUnixDate = uint64(offset.Timestamp)
			}

			url := fmt.Sprintf("https://prod-main-net-dashboard-api.azurewebsites.net/api/company/04bd44ea-0ff1-44be-a5a0-e502802c56d8/search?eventType=A.097bafa4e0b48eef.FindThoughts.Published&pageSize=%d&since=%d", 15000, startUnixDate)
			fetchData, err := s.httpClient.Get(url)
			if err != nil {
				fmt.Println("error fetching data", err)
				break
			}
			b, _ := io.ReadAll(fetchData.Body)
			var res fetchedThoughts
			json.Unmarshal(b, &res)
			if len(res) != 0 {
				s.dbClient.Transaction(func(tx *gorm.DB) error {
					maxEventDate := startUnixDate
					for _, event := range res {
						var thought model.Thought
						thought.ID = uint64(event.BlockEventData.ID)
						thought.Creator = event.BlockEventData.Creator
						thought.Header = event.BlockEventData.Header
						thought.Message = event.BlockEventData.Message
						thought.CreationDate = event.EventDate
						thought.BlockHeight = uint64(event.BlockHeight)

						if event.EventDate.Unix() > int64(maxEventDate) {
							maxEventDate = uint64(event.EventDate.Unix())
						}

						tx.Clauses(clause.OnConflict{
							Columns:   []clause.Column{{Name: "id"}},
							DoUpdates: clause.AssignmentColumns([]string{"creator", "header", "message", "creation_date", "block_height"}),
						}).Create(&thought)
					}
					var offset model.Offset
					offset.EventType = "thought_published"
					offset.Timestamp = uint64(maxEventDate)
					tx.Clauses(clause.OnConflict{
						Columns:   []clause.Column{{Name: "event_type"}},
						DoUpdates: clause.AssignmentColumns([]string{"timestamp"}),
					}).Create(&offset)

					return nil
				})
			}
			time.Sleep(10 * time.Second)
		}
		time.Sleep(60 * 60 * time.Second)
	}
}
