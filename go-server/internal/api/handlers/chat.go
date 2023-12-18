package handlers

import (
	"go-chatserver/internal/repository"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateChat(c *gin.Context, r *repository.Repository) {
	var createChatRequest repository.CreateChatRequest

	if err := c.ShouldBindJSON(&createChatRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	chat, err := r.Chats.Insert(c, createChatRequest)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, chat)
}

func FindUserChats(c *gin.Context, r *repository.Repository) {
	userId := c.Param("userId")
	chats, err := r.Chats.FindChatsByMember(c, userId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, chats)
}

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
