package main

import (
	"github.com/SamixDev/seek/config"
	"github.com/SamixDev/seek/internal/indexer"
	"github.com/SamixDev/seek/internal/server"
)

func main() {
	config.InitEnv()
	config.InitLog()

	indexer := indexer.New()
	indexer.Start()

	server := server.New()
	server.Start()
}
