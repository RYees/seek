package main

import (
	"github.com/SamixDev/seek/config"
	"github.com/SamixDev/seek/internal/indexer"
)

func main() {
	config.InitEnv()
	config.InitLog()

	indexer := indexer.New()
	indexer.Start()
}
