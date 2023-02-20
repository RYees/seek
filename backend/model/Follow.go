package model

import (
	"time"

	"gorm.io/datatypes"
)

type Follow struct {
	Follower     string `gorm:"uniqueIndex:compositeindex;type:text;not null"`
	Following    string `gorm:"uniqueIndex:compositeindex;type:text;not null"`
	Tags         datatypes.JSON
	CreationDate time.Time
	BlockHeight  uint64

	CreatedAt time.Time
	UpdatedAt time.Time
}
