package routes

import (
	"go-chatserver/internal/auth"
	"go-chatserver/internal/repository"
	"go-chatserver/internal/rest/handlers"
	"net/http"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// AuthRequired is a middleware that validates whether the users JWT bearer token is valid
func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")

		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}

		token := strings.TrimPrefix(authHeader, "Bearer ")

		if _, err := auth.ValidateJwtKey(token); err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}

		c.Next()
	}
}

// SetupRoutes takes in a gin router and sets up the routes
func SetupRoutes(router *gin.Engine, repo *repository.Repository) {
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AddAllowHeaders("Authorization")
	router.Use(cors.New(config))

	routes := router.Group("/api")
	{
		chats := routes.Group("/chats")
		{
			chats.Use(AuthRequired())

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

		}

		usersProtected := routes.Group("/users")
		{
			usersProtected.Use(AuthRequired())

			usersProtected.GET("/find/:userId", func(c *gin.Context) {
				handlers.FindUser(c, repo)
			})
			usersProtected.POST("/friends", func(c *gin.Context) {
				handlers.GetUserFriends(c, repo)
			})
			usersProtected.POST("/friends/add", func(c *gin.Context) {
				handlers.SendFriendRequest(c, repo)
			})
			usersProtected.POST("/friends/accept", func(c *gin.Context) {
				handlers.AcceptFriendRequest(c, repo)
			})
			usersProtected.POST("/friends/decline", func(c *gin.Context) {
				handlers.DeclineFriendRequest(c, repo)
			})
		}

		messages := routes.Group("/messages")
		{
			messages.Use(AuthRequired())

			messages.POST("/", func(c *gin.Context) {
				handlers.CreateMessage(c, repo)
			})
			messages.GET("/:chatId", func(c *gin.Context) {
				handlers.GetMessages(c, repo)
			})
		}

	}
	router.GET("/docs/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
}
