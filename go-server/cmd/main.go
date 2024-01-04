package main

import (
	"context"
	_ "go-chatserver/docs"
	"go-chatserver/internal/database"
	"go-chatserver/internal/rest"
	"log"
	"os"
	"os/signal"

	"github.com/gin-gonic/gin"
)

// @title           Chat API
// @version         1.0
// @description     This is a chat API
// @host      localhost:5000
// @BasePath  /api
func main() {
	router := gin.Default()
	db, err := database.Init()
	if err != nil {
		log.Fatal(err)
	}

	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt)
	defer cancel()

	srv := rest.NewServer(db, router)
	if err := srv.Start(ctx); err != nil {
		log.Fatal(err)
	}
}
