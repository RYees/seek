package config

import (
	"os"

	"github.com/spf13/viper"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

func InitEnv() {
	useEnvvar := os.Getenv("CONFIG_MODE") == "envvar"
	if !useEnvvar {
		viper.SetConfigName("local")
		viper.SetConfigType("yaml")
		viper.AddConfigPath("./config")
		err := viper.ReadInConfig()
		if err != nil {
			zap.L().Fatal("health server error; shutting down", zap.Error(err))
		}
	} else {
		viper.AutomaticEnv()
	}
}

var (
	atom   = zap.NewAtomicLevel()
	logger *zap.Logger
)

func InitLog() {
	encoderCfg := zap.NewProductionEncoderConfig()
	encoderCfg.EncodeTime = zapcore.ISO8601TimeEncoder
	logger = zap.New(zapcore.NewCore(
		zapcore.NewJSONEncoder(encoderCfg),
		zapcore.Lock(os.Stdout),
		atom,
	))
	zap.ReplaceGlobals(logger)
}
