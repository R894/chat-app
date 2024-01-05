package models

import (
	_ "go-chatserver/docs"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Message struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"_id"`
	ChatId    string             `bson:"chatId,omitempty" json:"chatId"`
	SenderId  string             `bson:"senderId,omitempty" json:"senderId"`
	Text      string             `bson:"text,omitempty" json:"text"`
	CreatedAt time.Time          `bson:"createdAt,omitempty" json:"createdAt"`
	UpdatedAt time.Time          `bson:"updatedAt,omitempty" json:"updatedAt"`
}
