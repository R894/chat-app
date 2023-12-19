package repository

import (
	"context"
	"go-chatserver/internal/models"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type CreateChatRequest struct {
	FirstId  string `json:"firstId" binding:"required"`
	SecondId string `json:"secondId" binding:"required"`
}

// ChatRepository handles database operations related to chats
// Validations are not expected here but rather at the handler level
type ChatRepository struct {
	collection *mongo.Collection
}

func NewChatRepository(collection *mongo.Collection) *ChatRepository {
	return &ChatRepository{collection: collection}
}

func (r *ChatRepository) FindByID(ctx context.Context, id primitive.ObjectID) (*models.Chat, error) {
	filter := primitive.M{"_id": id}

	var chat models.Chat
	err := r.collection.FindOne(ctx, filter).Decode(&chat)
	if err != nil {
		return nil, err
	}

	return &chat, nil
}

func (r *ChatRepository) Insert(ctx context.Context, chatReq CreateChatRequest) (*models.Chat, error) {
	chat := models.Chat{
		Members:   []string{chatReq.FirstId, chatReq.SecondId},
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
	result, err := r.collection.InsertOne(ctx, chat)
	if err != nil {
		return nil, err
	}
	chat.ID = result.InsertedID.(primitive.ObjectID)
	return &chat, nil
}

func (r *ChatRepository) FindChatByMembers(ctx context.Context, firstID string, secondID string) (*models.Chat, error) {
	filter := bson.M{
		"members": bson.M{
			"$all": []string{firstID, secondID},
		},
	}

	var chat models.Chat
	err := r.collection.FindOne(ctx, filter).Decode(&chat)
	if err != nil {
		return nil, err
	}

	return &chat, nil
}

func (r *ChatRepository) FindChatsByMember(ctx context.Context, userID string) (*[]models.Chat, error) {
	filter := bson.M{
		"members": bson.M{
			"$in": []string{userID},
		},
	}

	cursor, err := r.collection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var chats []models.Chat
	err = cursor.All(ctx, &chats)
	return &chats, nil
}
