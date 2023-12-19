package main

import (
	"go-chatserver/internal/database"
	"go-chatserver/internal/rest"
	"log"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	db, err := database.Init()
	if err != nil {
		log.Fatal(err)
	}
	srv := rest.NewServer(db, router)
	if err := srv.Start(); err != nil {
		log.Fatal(err)
	}
}
