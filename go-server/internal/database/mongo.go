package database

import (
	"context"
	"errors"
	"log"
	"os"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func Init() (*mongo.Client, error) {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}
	uri := os.Getenv("MONGODB_URL")
	if uri == "" {
		return nil, errors.New("You must set your 'MONGODB_URL' environment variable")
	}
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		log.Println(err)
		return nil, err
	}
	log.Println("Connected to MongoDB server")
	return client, nil
}

func CloseMongoDB(client *mongo.Client) {
	log.Println("Disconnecting from MongoDB server...")
	if err := client.Disconnect(context.TODO()); err != nil {
		log.Println(err)
	}
	log.Println("Disconnected")
}
