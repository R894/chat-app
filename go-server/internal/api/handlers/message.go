package handlers

import (
	"go-chatserver/internal/repository"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateMessage(c *gin.Context, r *repository.Repository) {
	var createMessageRequest repository.CreateMessageRequest
	if err := c.ShouldBindJSON(&createMessageRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	message, err := r.Messages.Insert(c, createMessageRequest)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, message)
}

func GetMessages(c *gin.Context, r *repository.Repository) {
	chatId := c.Param("chatId")
	messages, err := r.Messages.FindByChatID(c, chatId)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, messages)
}
