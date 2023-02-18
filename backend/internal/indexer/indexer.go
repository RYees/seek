package indexer

import (
	"context"
	"fmt"
	"time"

	"github.com/SamixDev/seek/internal/indexer/service"
	"go.uber.org/zap"
)

const (
	shutdownTimeout = time.Second * 15
)

type Indexer struct {
	service *service.Service
}

func New() *Indexer {
	// Init service
	service, err := service.NewService()
	if err != nil {
		zap.L().Fatal("failed to create service", zap.Error(err))
	}
	return &Indexer{
		service: service,
	}
}

func (indexer *Indexer) Start() {
	// Recover from panic
	defer func() {
		if err := recover(); err != nil {
			zap.L().Error("panic", zap.String("error", fmt.Sprintf("%+v", err)))
		}
	}()
	zap.L().Info("Rubik engine indexer started")

	// Start Cron Jobs for fetching data
	go indexer.service.SyncProfilesCreatedCron(context.Background())
	go indexer.service.SyncOldProfilesCreatedCron(context.Background())

}
