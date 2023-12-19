package handlers

import (
	"errors"
	"go-chatserver/internal/auth"
	"go-chatserver/internal/repository"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func FindUser(c *gin.Context, r *repository.Repository) {
	id := c.Param("userId")
	result, err := r.Users.FindByID(c, id)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			c.JSON(http.StatusNotFound, "Not Found")
			return
		}
		c.JSON(http.StatusInternalServerError, "Internal server error")
	}
	c.JSON(http.StatusOK, result)
}

func RegisterUser(c *gin.Context, r *repository.Repository) {
	var registerRequest repository.RegisterUserRequest
	if err := c.ShouldBindJSON(&registerRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	user, err := r.Users.InsertUser(c, registerRequest)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, user)
}

func LoginUser(c *gin.Context, r *repository.Repository) {
	var loginRequest LoginRequest
	if err := c.ShouldBindJSON(&loginRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	user, err := r.Users.FindByEmail(c, loginRequest.Email)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			c.JSON(http.StatusNotFound, "Not Found")
			return
		}
		c.JSON(http.StatusInternalServerError, "Internal server error")
		return
	}

	err = auth.VerifyPassword(user.Password, loginRequest.Password)

	if err != nil {
		c.JSON(http.StatusBadRequest, "Bad request")
		return
	}

	c.JSON(http.StatusOK, user)
}

func GetUsers(c *gin.Context, r *repository.Repository) {
	users, err := r.Users.GetAllUsers(c)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			c.JSON(http.StatusNotFound, "Not Found")
			return
		}

		c.JSON(http.StatusInternalServerError, "Internal server error")
		return
	}
	c.JSON(http.StatusOK, users)
}
