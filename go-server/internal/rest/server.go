package rest

import (
	"context"
	"fmt"
	"go-chatserver/internal/database"
	"go-chatserver/internal/repository"
	"go-chatserver/internal/rest/routes"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

type server struct {
	db         *mongo.Client
	router     *gin.Engine
	repository *repository.Repository
}

func NewServer(db *mongo.Client, router *gin.Engine) *server {
	return &server{
		db:         db,
		router:     router,
		repository: repository.NewRepository(db.Database("chatApp")), // Hardcode for now im lazy lol
	}
}

func (s *server) Start(ctx context.Context) error {
	routes.SetupRoutes(s.router, s.repository)
	port := os.Getenv("PORT")
	if port == "" {

	}
	server := &http.Server{
		Addr:    fmt.Sprintf(":%s", port),
		Handler: s.router,
	}

	defer func() {
		database.CloseMongoDB(s.db)
	}()

	ch := make(chan error, 1)

	go func() {
		err := server.ListenAndServe()
		if err != nil {
			ch <- fmt.Errorf("Failed to start server: %w", err)
		}
		fmt.Println("Server running on port 5000")
		close(ch)
	}()

	select {
	case err := <-ch:
		return err
	case <-ctx.Done():
		log.Println("Received interrupt signal. Starting graceful shutdown...")
		timeout, cancel := context.WithTimeout(context.Background(), time.Second*10)
		defer cancel()

		return server.Shutdown(timeout)
	}
}
