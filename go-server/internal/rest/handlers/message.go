package handlers

import (
	"go-chatserver/internal/models"
	"go-chatserver/internal/repository"
	"net/http"
	"sort"

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

	user, err := r.Users.FindByID(c, message.SenderId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	messageWithUser := MessageWithUser{
		Message:  *message,
		UserName: user.Name,
	}

	c.JSON(http.StatusOK, messageWithUser)
}

func GetMessages(c *gin.Context, r *repository.Repository) {
	chatID := c.Param("chatId")

	messages, err := r.Messages.FindByChatID(c, chatID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var messagesWithUser []MessageWithUser

	// batch user IDs for retrieval
	var userIds []string
	userIdsMap := make(map[string]bool)

	for _, msg := range messages {
		if _, exists := userIdsMap[msg.SenderId]; !exists {
			userIds = append(userIds, msg.SenderId)
			userIdsMap[msg.SenderId] = true
		}
	}

	// retrieve users in batch
	users, err := r.Users.FindMultipleById(c, userIds)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	userMap := make(map[string]*models.User)
	for _, user := range users {
		userMap[user.ID.Hex()] = user
	}

	// combine messages and user information
	for _, msg := range messages {
		user, exists := userMap[msg.SenderId]
		if !exists {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}

		messageWithUser := MessageWithUser{
			Message:  *msg,
			UserName: user.Name,
		}

		messagesWithUser = append(messagesWithUser, messageWithUser)
	}

	// sort messagesWithUser by creation date
	sort.Slice(messagesWithUser, func(i, j int) bool {
		return messagesWithUser[i].Message.CreatedAt.Before(messagesWithUser[j].Message.CreatedAt)
	})

	c.JSON(http.StatusOK, messagesWithUser)
}
