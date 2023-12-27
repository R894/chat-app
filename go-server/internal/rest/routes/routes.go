package routes

import (
	"go-chatserver/internal/repository"
	"go-chatserver/internal/rest/handlers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

// SetupRoutes takes in a gin router and sets up the routes
func SetupRoutes(router *gin.Engine, repo *repository.Repository) {
	router.Use(cors.Default())
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
			users.POST("/friends", func(c *gin.Context) {
				handlers.GetUserFriends(c, repo)
			})
			users.POST("/friends/add", func(c *gin.Context) {
				handlers.SendFriendRequest(c, repo)
			})
			users.POST("/friends/accept", func(c *gin.Context) {
				handlers.AcceptFriendRequest(c, repo)
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
