package repository

import (
	"context"
	"go-chatserver/internal/models"
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

// MessageRepository handles database operations related to messages
// Validations are not expected here but rather at the handler level
type MessageRepository struct {
	collection *mongo.Collection
}

func NewMessageRepository(collection *mongo.Collection) *MessageRepository {
	return &MessageRepository{collection: collection}
}

func (r *MessageRepository) Insert(ctx context.Context, message CreateMessageRequest) (*models.Message, error) {
	newMessage := models.Message{
		ChatId:    message.ChatId,
		Text:      message.Text,
		SenderId:  message.SenderId,
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

func (r *MessageRepository) FindByID(ctx context.Context, id primitive.ObjectID) (*models.Message, error) {
	filter := primitive.M{"_id": id}

	var message models.Message
	err := r.collection.FindOne(ctx, filter).Decode(&message)
	if err != nil {
		return nil, err
	}

	return &message, nil
}

func (r *MessageRepository) FindByChatID(ctx context.Context, chatID string) ([]*models.Message, error) {
	filter := bson.M{
		"chatId": chatID,
	}

	cursor, err := r.collection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var messages []*models.Message
	err = cursor.All(ctx, &messages)
	if err != nil {
		return nil, err
	}

	return messages, nil
}
