package service

import (
	"fmt"
	"time"

	"github.com/spf13/viper"
	"go.uber.org/zap"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Service struct {
	dbClient *gorm.DB
}

func NewService() (*Service, error) {

	// db client init
	db_client, err := gorm.Open(postgres.New(postgres.Config{
		DSN: fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s",
			viper.GetString("POSTGRES_HOST"),
			viper.GetString("POSTGRES_USER"),
			viper.GetString("POSTGRES_PASSWORD"),
			viper.GetString("POSTGRES_DBNAME"),
			viper.GetString("POSTGRES_PORT"),
		),
		PreferSimpleProtocol: true,
	}), &gorm.Config{CreateBatchSize: 1000})
	if err != nil {
		zap.L().Fatal("failed to connect database", zap.Error(err))
		return nil, err
	}
	sqlDB, err := db_client.DB()
	if err != nil {
		zap.L().Fatal("failed to config database", zap.Error(err))
		return nil, err
	}

	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)

	// Migrate the schema
	err = db_client.AutoMigrate()
	if err != nil {
		zap.L().Fatal("failed to migrate database", zap.Error(err))
		return nil, err
	}

	return &Service{
		dbClient: db_client,
	}, nil
}
