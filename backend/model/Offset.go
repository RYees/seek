package model

import (
	"time"
)

type Offset struct {
	EventType   string `gorm:"primaryKey"`
	BlockHeight uint64
	Timestamp   uint64

	CreatedAt time.Time
	UpdatedAt time.Time
}
