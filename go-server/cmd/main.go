package main

import (
	"go-chatserver/internal/api"
	"go-chatserver/internal/database"
	"log"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	db, err := database.Init()
	if err != nil {
		log.Fatal(err)
	}
	srv := api.NewServer(db, router)
	if err := srv.Start(); err != nil {
		log.Fatal(err)
	}
}
