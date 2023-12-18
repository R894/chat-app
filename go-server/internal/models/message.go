package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Message struct {
	ID        primitive.ObjectID `bson:"_id,omitempty"`
	ChatId    string             `bson:"chatId,omitempty"`
	SenderId  string             `bson:"senderId,omitempty"`
	Text      string             `bson:"text,omitempty"`
	CreatedAt time.Time          `bson:"createdAt,omitempty"`
	UpdatedAt time.Time          `bson:"updatedAt,omitempty"`
}
