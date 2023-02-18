package service

import (
	"fmt"
	"net"
	"net/http"
	"time"

	"github.com/SamixDev/seek/model"
	. "github.com/bjartek/overflow"
	"github.com/spf13/viper"
	"go.uber.org/zap"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Service struct {
	dbClient   *gorm.DB
	flowClient *OverflowState
	httpClient *http.Client
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
	err = db_client.AutoMigrate(&model.Offset{}, &model.Profile{}, &model.Historical{})
	if err != nil {
		zap.L().Fatal("failed to migrate database", zap.Error(err))
		return nil, err
	}

	// flow client init
	overflow := Overflow(WithNetwork(viper.GetString("OVERFLOW_ENV")))

	// http client init
	http_client := new(http.Client)
	var transport http.RoundTripper = &http.Transport{
		Proxy:              http.ProxyFromEnvironment,
		DisableKeepAlives:  false,
		DisableCompression: false,
		DialContext: (&net.Dialer{
			Timeout:   30 * time.Second,
			KeepAlive: 300 * time.Second,
			DualStack: true,
		}).DialContext,
		ForceAttemptHTTP2:     true,
		MaxIdleConns:          100,
		IdleConnTimeout:       90 * time.Second,
		TLSHandshakeTimeout:   5 * time.Second,
		ExpectContinueTimeout: 1 * time.Second,
	}
	http_client.Transport = transport

	return &Service{
		dbClient:   db_client,
		flowClient: overflow,
		httpClient: http_client,
	}, nil

}
