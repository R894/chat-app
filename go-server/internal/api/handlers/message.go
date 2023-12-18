package handlers

import "github.com/gin-gonic/gin"

func CreateMessage(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "Create Message",
	})
}

func GetMessages(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "Get Messages",
	})
}
