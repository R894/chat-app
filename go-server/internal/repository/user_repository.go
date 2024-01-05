package repository

import (
	"context"
	"fmt"
	"go-chatserver/internal/models"
	"go-chatserver/internal/utils"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type RegisterUserRequest struct {
	Name     string `json:"name" binding:"required" validate:"required,min=4,max=15"`
	Email    string `json:"email" binding:"required" validate:"required,email"`
	Password string `json:"password" binding:"required" validate:"required,min=6"`
}

// UserRepository handles database operations related to users
// Validations are not expected here but rather at the handler level
type UserRepository struct {
	collection *mongo.Collection
}

func NewUserRepository(collection *mongo.Collection) *UserRepository {
	return &UserRepository{collection: collection}
}

func (r *UserRepository) FindByID(ctx context.Context, id string) (*models.User, error) {
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, fmt.Errorf("error converting ID to ObjectID: %v", err)
	}

	filter := primitive.M{"_id": objID}

	var user models.User
	err = r.collection.FindOne(ctx, filter).Decode(&user)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *UserRepository) FindMultipleById(ctx context.Context, userIds []string) ([]*models.User, error) {
	var objectIDs []primitive.ObjectID
	for _, userID := range userIds {
		objectID, err := primitive.ObjectIDFromHex(userID)
		if err != nil {
			return nil, err
		}
		objectIDs = append(objectIDs, objectID)
	}

	filter := bson.M{"_id": bson.M{"$in": objectIDs}}

	cursor, err := r.collection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var users []*models.User
	err = cursor.All(ctx, &users)
	if err != nil {
		return nil, err
	}

	return users, nil
}

func (r *UserRepository) GetAllUsers(ctx context.Context) ([]*models.User, error) {
	cursor, err := r.collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var users []*models.User
	err = cursor.All(ctx, &users)
	if err != nil {
		return nil, err
	}

	return users, nil
}

func (r *UserRepository) FindByEmail(ctx context.Context, email string) (*models.User, error) {
	filter := primitive.M{"email": email}

	var user models.User
	err := r.collection.FindOne(ctx, filter).Decode(&user)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) GetUserFriends(ctx context.Context, userId string) ([]models.User, error) {

	user, err := r.FindByID(ctx, userId)
	if err != nil {
		return nil, err
	}

	if len(user.FriendsList) < 1 {
		return []models.User{}, nil
	}

	// convert friendslist strings to objectIds because im dumb and didnt do that before
	var objectIds []primitive.ObjectID
	for _, friendId := range user.FriendsList {
		objID, err := primitive.ObjectIDFromHex(friendId)
		if err != nil {
			return nil, err
		}
		objectIds = append(objectIds, objID)
	}

	filter := bson.M{"_id": bson.M{"$in": objectIds}}
	cursor, err := r.collection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var friends []models.User
	err = cursor.All(ctx, &friends)
	if err != nil {
		return nil, err
	}
	return friends, nil
}

// InsertFriendRequest appends userId into the friendRequest array of the User with friendId
func (r *UserRepository) InsertFriendRequest(ctx context.Context, userId, friendId string) (bool, error) {
	// convert friendId string to objId
	friendObjId, err := primitive.ObjectIDFromHex(friendId)
	if err != nil {
		return false, fmt.Errorf("error converting ID to ObjectID: %v", err)
	}

	// find the user, return false if doesnt exist
	var friend models.User
	err = r.collection.FindOne(ctx, primitive.M{"_id": friendObjId}).Decode(&friend)
	if err != nil {
		return false, err
	}

	// append the new id into the pending friend requests array
	friend.PendingRequests = append(friend.PendingRequests, userId)

	// update the friend document in the database
	update := bson.M{"$set": bson.M{"pendingRequests": friend.PendingRequests}}
	_, err = r.collection.UpdateOne(ctx, primitive.M{"_id": friendObjId}, update)
	if err != nil {
		return false, fmt.Errorf("error updating: %v", err)
	}

	return true, nil
}

// DeleteFriendRequest removes friendId from the pendingRequest array of the user with userId
func (r *UserRepository) DeleteFriendRequest(ctx context.Context, userId, friendId string) (bool, error) {
	// convert userId string to objId
	userObjId, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		return false, fmt.Errorf("error converting ID to ObjectID: %v", err)
	}

	// find the user, return false if doesnt exist
	var user models.User
	err = r.collection.FindOne(ctx, primitive.M{"_id": userObjId}).Decode(&user)
	if err != nil {
		return false, err
	}

	// remove friendId from pendingRequests array
	user.PendingRequests = utils.RemoveStringFromArray(user.PendingRequests, friendId)

	// update the user document in the database
	update := bson.M{"$set": bson.M{"pendingRequests": user.PendingRequests}}
	_, err = r.collection.UpdateOne(ctx, primitive.M{"_id": userObjId}, update)
	if err != nil {
		return false, fmt.Errorf("error updating user document: %v", err)
	}

	return true, nil
}

func (r *UserRepository) InsertFriend(ctx context.Context, userId, friendId string) (bool, error) {
	// convert userId string to objId
	userObjId, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		return false, fmt.Errorf("error converting ID to ObjectID: %v", err)
	}

	// find the user, return false if doesnt exist
	var user models.User
	err = r.collection.FindOne(ctx, primitive.M{"_id": userObjId}).Decode(&user)
	if err != nil {
		return false, err
	}

	// append the new id into the friendslist array
	user.FriendsList = append(user.FriendsList, friendId)

	// update the friend document in the database
	update := bson.M{"$set": bson.M{"friendsList": user.FriendsList}}
	_, err = r.collection.UpdateOne(ctx, primitive.M{"_id": userObjId}, update)
	if err != nil {
		return false, fmt.Errorf("error updating: %v", err)
	}

	return true, nil
}

func (r *UserRepository) InsertUser(ctx context.Context, userRequest RegisterUserRequest) (*models.User, error) {
	var user models.User
	user.Name = userRequest.Name
	user.Password = userRequest.Password
	user.Email = userRequest.Email
	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()
	result, err := r.collection.InsertOne(ctx, user)
	if err != nil {
		return nil, err
	}

	user.ID = result.InsertedID.(primitive.ObjectID)
	return &user, nil
}
