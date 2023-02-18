package model

import (
	"time"
)

type Historical struct {
	Type    string
	Indexed bool `gorm:"default:false"`

	CreatedAt time.Time
	UpdatedAt time.Time
}
