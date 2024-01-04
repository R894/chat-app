package models

import (
	_ "go-chatserver/docs"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID              primitive.ObjectID `bson:"_id,omitempty" json:"_id"`
	Name            string             `bson:"name,omitempty" json:"name"`
	Email           string             `bson:"email,omitempty" json:"email"`
	Password        string             `bson:"password,omitempty" json:"-"`
	CreatedAt       time.Time          `bson:"createdAt,omitempty" json:"createdAt"`
	UpdatedAt       time.Time          `bson:"updatedAt,omitempty" json:"updatedAt"`
	PendingRequests []string           `bson:"pendingRequests" json:"pendingRequests"`
	FriendsList     []string           `bson:"friendsList,omitempty" json:"friendsList"`
}
