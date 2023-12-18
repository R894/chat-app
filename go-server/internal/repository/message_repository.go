package repository

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Message struct {
	ID        primitive.ObjectID `bson:"_id,omitempty"`
	ChatId    string             `bson:"chatId,omitempty"`
	Text      string             `bson:"text,omitempty"`
	CreatedAt time.Time          `bson:"createdAt,omitempty"`
	UpdatedAt time.Time          `bson:"updatedAt,omitempty"`
}

// MessageRepository handles database operations related to messages
type MessageRepository struct {
	collection *mongo.Collection
}

func NewMessageRepository(collection *mongo.Collection) *MessageRepository {
	return &MessageRepository{collection: collection}
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
