package main

import (
	"context"
	"go-chatserver/internal/database"
	"go-chatserver/internal/rest"
	"log"
	"os"
	"os/signal"

	"github.com/gin-gonic/gin"
)

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
