package repository

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type CreateMessageRequest struct {
	ChatId   string `json:"chatId" binding:"required"`
	SenderId string `json:"senderId" binding:"required"`
	Text     string `json:"text" binding:"required"`
}

type Message struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"_id"`
	ChatId    string             `bson:"chatId,omitempty" json:"chatId"`
	Text      string             `bson:"text,omitempty" json:"text"`
	CreatedAt time.Time          `bson:"createdAt,omitempty" json:"createdAt"`
	UpdatedAt time.Time          `bson:"updatedAt,omitempty" json:"updatedAt"`
}

// MessageRepository handles database operations related to messages
// Validations are not expected here but rather at the handler level
type MessageRepository struct {
	collection *mongo.Collection
}

func NewMessageRepository(collection *mongo.Collection) *MessageRepository {
	return &MessageRepository{collection: collection}
}

func (r *MessageRepository) Insert(ctx context.Context, message CreateMessageRequest) (*Message, error) {
	newMessage := Message{
		ChatId:    message.ChatId,
		Text:      message.Text,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
	result, err := r.collection.InsertOne(ctx, newMessage)
	if err != nil {
		return nil, err
	}

	newMessage.ID = result.InsertedID.(primitive.ObjectID)
	return &newMessage, nil
}

func (r *MessageRepository) FindByID(ctx context.Context, id primitive.ObjectID) (*Message, error) {
	filter := primitive.M{"_id": id}

	var message Message
	err := r.collection.FindOne(ctx, filter).Decode(&message)
	if err != nil {
		return nil, err
	}

	return &message, nil
}

func (r *MessageRepository) FindByChatID(ctx context.Context, chatID string) ([]Message, error) {
	filter := bson.M{
		"chatId": chatID,
	}

	cursor, err := r.collection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var messages []Message
	err = cursor.All(ctx, &messages)
	if err != nil {
		return nil, err
	}

	return messages, nil
}
