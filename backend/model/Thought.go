package model

import (
	"time"

	"gorm.io/datatypes"
)

type Thought struct {
	ID           uint64         `gorm:"primaryKey" json:"id"`
	Creator      string         `json:"creator"`
	Header       string         `json:"header"`
	Message      string         `json:"message"`
	Media        datatypes.JSON `json:"media"`
	CreationDate time.Time      `json:"creation_date"`
	BlockHeight  uint64         `json:"block_height"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
