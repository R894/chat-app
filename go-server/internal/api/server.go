package api

import (
	"go-chatserver/internal/api/routes"
	"go-chatserver/internal/repository"

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

func (s *server) Start() error {
	routes.SetupRoutes(s.router, s.repository)
	return s.router.Run()
}
