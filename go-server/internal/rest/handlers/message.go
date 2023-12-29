package handlers

import (
	"go-chatserver/internal/models"
	"go-chatserver/internal/repository"
	"net/http"

	"github.com/gin-gonic/gin"
)

type MessageWithUser struct {
	Message  models.Message `json:"message"`
	UserName string         `json:"userName"`
}

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
	// TODO: this is inefficient, think of a way to improve this later
	chatId := c.Param("chatId")

	messages, err := r.Messages.FindByChatID(c, chatId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var messagesWithUser []MessageWithUser

	// using goroutines reduces request time but its still slow
	resultChan := make(chan MessageWithUser)

	for _, msg := range messages {
		go func(message *models.Message) {
			user, err := r.Users.FindByID(c, message.SenderId)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}

			messageWithUser := MessageWithUser{
				Message:  *message,
				UserName: user.Name,
			}

			resultChan <- messageWithUser
		}(msg)
	}

	for range messages {
		messageWithUser := <-resultChan
		messagesWithUser = append(messagesWithUser, messageWithUser)
	}

	c.JSON(http.StatusOK, messagesWithUser)
	close(resultChan)
}
