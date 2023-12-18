package handlers

import "github.com/gin-gonic/gin"

func FindUser(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "Find User",
	})
}
func RegisterUser(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "Register User",
	})
}

func LoginUser(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "Login User",
	})
}

func GetUsers(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "Get Users",
	})
}
