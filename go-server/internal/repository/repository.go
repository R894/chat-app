package repository

import "go.mongodb.org/mongo-driver/mongo"

// Repository compiles all the repositories into a single struct
type Repository struct {
	Messages MessageRepository
	Chats    ChatRepository
	Users    UserRepository
}

func NewRepository(db *mongo.Database) *Repository {
	return &Repository{
		Messages: MessageRepository{collection: db.Collection("messages")},
		Chats:    ChatRepository{collection: db.Collection("chats")},
		Users:    UserRepository{collection: db.Collection("users")},
	}
}
