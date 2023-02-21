package model

import (
	"time"
)

type Thought struct {
	ID           uint64    `gorm:"primaryKey" json:"id"`
	Creator      string    `json:"creator"`
	Header       string    `json:"header"`
	Message      string    `json:"message"`
	CreationDate time.Time `json:"creation_date"`
	BlockHeight  uint64    `json:"block_height"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
