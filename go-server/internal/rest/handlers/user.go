package handlers

import (
	"errors"
	"fmt"
	"go-chatserver/internal/auth"
	"go-chatserver/internal/repository"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator"
	"go.mongodb.org/mongo-driver/mongo"
)

type LoginRequest struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type GetUserFriendsRequest struct {
	UserId string `json:"userId" binding:"required"`
}
type FriendRequest struct {
	UserId   string `json:"userId" binding:"required"`
	FriendId string `json:"friendId" binding:"required"`
}

// @Summary Find a user by ID
// @Description Retrieves a user by their ID.
// @ID find-user
// @Accept  json
// @Produce  json
// @Param   userId     path    string     true        "ID of the user"
// @Success 200 {object} models.User  "Returns the user with the specified ID"
// @Router /users/{userId} [get]
func FindUser(c *gin.Context, r *repository.Repository) {
	id := c.Param("userId")
	result, err := r.Users.FindByID(c, id)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			c.JSON(http.StatusNotFound, "Not Found")
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Something went wrong"})
		return
	}
	c.JSON(http.StatusOK, result)
}

// @Summary Register a new user
// @Description Registers a new user and returns the user information along with a JWT token.
// @ID register-user
// @Accept  json
// @Produce  json
// @Param   request     body    repository.RegisterUserRequest     true        "JSON request to register a new user"
// @Success 200 {object} object  "Returns the registered user and a JWT token"
// @Router /users/register [post]
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
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Something went wrong"})
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
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Something went wrong"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user":  user,
		"token": key,
	})
}

// @Summary Accept a friend request
// @Description Accepts a friend request between two users.
// @ID accept-friend-request
// @Accept  json
// @Produce  json
// @Param   request     body    FriendRequest     true        "JSON request to accept a friend request"
// @Success 200 {object} object  "Returns a success message"
// @Router /users/friends/accept [post]
func AcceptFriendRequest(c *gin.Context, r *repository.Repository) {
	var request FriendRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := r.Users.InsertFriend(c, request.UserId, request.FriendId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "something went wrong"})
		return
	}
	// friendship goes both ways!
	_, err = r.Users.InsertFriend(c, request.FriendId, request.UserId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "something went wrong"})
		return
	}

	// remove the friend request from the user afterwards
	_, err = r.Users.DeleteFriendRequest(c, request.UserId, request.FriendId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "something went wrong"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "friend request accepted"})

}

// @Summary Decline a friend request
// @Description Declines a friend request between two users.
// @ID decline-friend-request
// @Accept  json
// @Produce  json
// @Param   request     body    FriendRequest     true        "JSON request to decline a friend request"
// @Success 200 {object} object  "Returns a success message"
// @Router /users/friends/decline [post]
func DeclineFriendRequest(c *gin.Context, r *repository.Repository) {
	var request FriendRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := r.Users.DeleteFriendRequest(c, request.UserId, request.FriendId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "friend request accepted"})
}

// @Summary Send a friend request
// @Description Sends a friend request from one user to another.
// @ID send-friend-request
// @Accept  json
// @Produce  json
// @Param   request     body    FriendRequest     true        "JSON request to send a friend request"
// @Success 200 {object} object  "Returns a success message"
// @Router /users/friends/add [post]
func SendFriendRequest(c *gin.Context, r *repository.Repository) {
	var friendRequest FriendRequest
	if err := c.ShouldBindJSON(&friendRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := r.Users.InsertFriendRequest(c, friendRequest.UserId, friendRequest.FriendId)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to send friend request"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Friend request sent"})
}

// @Summary Login user
// @Description Authenticates a user based on their email and password, returning the user information and a JWT token.
// @ID login-user
// @Accept  json
// @Produce  json
// @Param   request     body    LoginRequest     true        "JSON request to log in a user"
// @Success 200 {object} object  "Returns the authenticated user and a JWT token"
// @Router /users/login [post]
func LoginUser(c *gin.Context, r *repository.Repository) {
	var loginRequest LoginRequest
	if err := c.ShouldBindJSON(&loginRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := r.Users.FindByEmail(c, loginRequest.Email)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}

	err = auth.VerifyPassword(user.Password, loginRequest.Password)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	key, err := auth.GenerateJwtKey(user.ID.String())
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"user":  user,
		"token": key})
}

// @Summary Get all users
// @Description Retrieves all users.
// @ID get-users
// @Accept  json
// @Produce  json
// @Success 200 {array} models.User  "Returns the list of all users"
// @Router /users/ [get]
func GetUsers(c *gin.Context, r *repository.Repository) {
	users, err := r.Users.GetAllUsers(c)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}
	c.JSON(http.StatusOK, users)
}

// @Summary Get friends of a user
// @Description Retrieves the friends of a user.
// @ID get-user-friends
// @Accept  json
// @Produce  json
// @Param   userId     path    string     true        "ID of the user"
// @Success 200 {array} models.User  "Returns the list of user's friends"
// @Router /users/friends [post]
func GetUserFriends(c *gin.Context, r *repository.Repository) {
	var userId GetUserFriendsRequest
	if err := c.ShouldBindJSON(&userId); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	friends, err := r.Users.GetUserFriends(c, userId.UserId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching friends"})
		fmt.Println(err)
		return
	}
	c.JSON(http.StatusOK, friends)
}
