package server

import (
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
	"go.uber.org/zap"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

const (
	defaultPort     = ":8080"
	shutdownTimeout = time.Second * 5
)

type Server struct {
	dbClient   *gorm.DB
	httpClient *gin.Engine
}

func New() *Server {

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
		return nil
	}
	sqlDB, err := db_client.DB()
	if err != nil {
		zap.L().Fatal("failed to config database", zap.Error(err))
		return nil
	}

	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)

	// http client init
	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()

	return &Server{
		dbClient:   db_client,
		httpClient: r,
	}
}

func (s *Server) Start() {
	// Recover from panic
	defer func() {
		if err := recover(); err != nil {
			zap.L().Error("panic", zap.String("error", fmt.Sprintf("%+v", err)))
		}
	}()

	// Start server
	zap.L().Info("Seek engine server started")
	if err := s.httpClient.Run(); err != nil {
		zap.L().Error("failed to start server", zap.Error(err))
	}

}
