package model

import (
	"time"
)

type Profile struct {
	Address      string `gorm:"primaryKey"`
	UserName     string
	FindName     string
	Platform     string
	Thumbnail    string
	CreationDate time.Time

	CreatedAt time.Time
	UpdatedAt time.Time
}
