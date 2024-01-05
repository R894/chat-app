package handlers

import (
	_ "go-chatserver/docs"
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

// @Summary Create a new message in a chat
// @Description Creates a new message in a chat and returns the message along with the sender's username.
// @ID create-message
// @Accept  json
// @Produce  json
// @Param   request     body    repository.CreateMessageRequest     true        "JSON request to create a message"
// @Success 200 {object} MessageWithUser  "Returns the created message with the sender's username"
// @Router /messages [post]
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

// @Summary Get messages in a chat
// @Description Retrieves messages in a chat, including sender usernames, and returns them sorted by creation date.
// @ID get-messages
// @Accept  json
// @Produce  json
// @Param   chatId     path    string     true        "ID of the chat"
// @Success 200 {array} MessageWithUser  "Returns the list of messages in the chat with sender usernames"
// @Router /messages/{chatId} [get]
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

	if len(userIdsMap) < 1 {
		c.JSON(http.StatusOK, messagesWithUser)
		return
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
