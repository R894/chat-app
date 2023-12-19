package routes

import (
	"go-chatserver/internal/api/handlers"
	"go-chatserver/internal/repository"

	"github.com/gin-gonic/gin"
)

// SetupRoutes takes in a gin router and sets up the routes
func SetupRoutes(router *gin.Engine, repo *repository.Repository) {
	// something tells me there's a better way to do this, but this is fine for now
	routes := router.Group("/api")
	{
		chats := routes.Group("/chats")
		{
			chats.POST("/", func(c *gin.Context) {
				handlers.CreateChat(c, repo)
			})

			chats.GET("/:userId", func(c *gin.Context) {
				handlers.FindUserChats(c, repo)
			})

			chats.GET("/find/:firstId/:secondId", func(c *gin.Context) {
				handlers.FindChat(c, repo)
			})
		}

		users := routes.Group("/users")
		{
			users.GET("/", func(c *gin.Context) {
				handlers.GetUsers(c, repo)
			})
			users.POST("/register", func(c *gin.Context) {
				handlers.RegisterUser(c, repo)
			})
			users.POST("/login", func(c *gin.Context) {
				handlers.LoginUser(c, repo)
			})
			users.GET("/find/:userId", func(c *gin.Context) {
				handlers.FindUser(c, repo)
			})
		}

		messages := routes.Group("/messages")
		{
			messages.POST("/", func(c *gin.Context) {
				handlers.CreateMessage(c, repo)
			})
			messages.GET("/:chatId", func(c *gin.Context) {
				handlers.GetMessages(c, repo)
			})
		}

	}
}
