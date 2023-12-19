package handlers

import (
	"errors"
	"go-chatserver/internal/auth"
	"go-chatserver/internal/repository"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator"
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
	validate := validator.New()
	var registerRequest repository.RegisterUserRequest
	if err := c.ShouldBindJSON(&registerRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err := validate.Struct(registerRequest)
	if err != nil {
		var validationErrors []string
		for _, e := range err.(validator.ValidationErrors) {
			validationErrors = append(validationErrors, e.Field()+" is not in the expected format")
		}

		c.JSON(http.StatusBadRequest, gin.H{"errors": validationErrors})
		return
	}

	hashedPassword, err := auth.HashPassword(registerRequest.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, "Something went wrong")
		return
	}
	registerRequest.Password = hashedPassword
	user, err := r.Users.InsertUser(c, registerRequest)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	key, err := auth.GenerateJwtKey(user.ID.String())
	if err != nil {
		c.JSON(http.StatusInternalServerError, "Something went wrong")
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"_id":       user.ID,
		"name":      user.Name,
		"email":     user.Email,
		"createdAt": user.CreatedAt,
		"updatedAt": user.UpdatedAt,
		"token":     key,
	})
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

	key, err := auth.GenerateJwtKey(user.ID.String())
	if err != nil {
		c.JSON(http.StatusBadRequest, "Bad request")
		return
	}
	c.JSON(http.StatusOK, gin.H{"name": user.Name, "email": user.Email, "token": key})
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
