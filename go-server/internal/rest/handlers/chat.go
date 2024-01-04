package handlers

import (
	_ "go-chatserver/docs"
	"go-chatserver/internal/repository"
	"net/http"

	"github.com/gin-gonic/gin"
)

// @Summary Create a new chat or return an existing one
// @Description Creates a new chat between two users or returns an existing chat if one already exists.
// @ID create-chat
// @Accept  json
// @Produce  json
// @Param   request     body    repository.CreateChatRequest     true        "JSON request to create a chat"
// @Success 200 {object} models.Chat  "Returns the created or existing chat"
// @Router /chats [post]
func CreateChat(c *gin.Context, r *repository.Repository) {
	var createChatRequest repository.CreateChatRequest

	if err := c.ShouldBindJSON(&createChatRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if chat already exists
	res, _ := r.Chats.FindChatByMembers(c, createChatRequest.FirstId, createChatRequest.SecondId)

	// Return the chat if it already exists
	if res != nil {
		c.JSON(http.StatusOK, res)
		return
	}

	// Otherwise create it
	chat, err := r.Chats.Insert(c, createChatRequest)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, chat)
}

// @Summary Get all chats for a specific user
// @Description Retrieves all chats for a given user.
// @ID find-user-chats
// @Accept  json
// @Produce  json
// @Param   userId     path    string     true        "ID of the user"
// @Success 200 {array} models.Chat  "Returns the list of user's chats"
// @Router /chats/{userId} [get]
func FindUserChats(c *gin.Context, r *repository.Repository) {
	userId := c.Param("userId")
	chats, err := r.Chats.FindChatsByMember(c, userId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, chats)
}

// @Summary Get a chat between two specific users
// @Description Retrieves a chat between two specified users.
// @ID find-chat
// @Accept  json
// @Produce  json
// @Param   firstId     path    string     true        "ID of the first user"
// @Param   secondId    path    string     true        "ID of the second user"
// @Success 200 {object} models.Chat  "Returns the chat between the specified users"
// @Router /chats/find/{firstId}/{secondId} [get]
func FindChat(c *gin.Context, r *repository.Repository) {
	firstId := c.Param("firstId")
	secondId := c.Param("secondId")

	chat, err := r.Chats.FindChatByMembers(c, firstId, secondId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, chat)
}
