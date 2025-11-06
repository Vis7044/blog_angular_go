package repositories

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/blog_go/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	// "go.mongodb.org/mongo-driver/bson/primitive"
)

type AuthRepository struct {
	collection *mongo.Collection
}

func NewAuthRepository(db *mongo.Database) *AuthRepository {
	return &AuthRepository{
		collection: db.Collection("User"),
	}
}

/*
Temp: context.Context is a built-in Go interface used to control the lifecycle of a request or operation —
like timeouts, cancellations, and passing metadata across function calls.
You might write:

result, err := collection.FindOne(nil, filter)


Here, nil means no context — so the operation runs until it’s done, even if the client disconnects.

✅ Example: With context

You can instead write:

ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()

result := collection.FindOne(ctx, filter)


Now the MongoDB query will auto-cancel if it takes more than 5 seconds.
Also, if the client cancels the request, Go cancels the context too — freeing resources
*/

func (ar *AuthRepository) Register(ctx context.Context, user models.User) (string, error) {
	ctx, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()
	_, err := ar.collection.InsertOne(ctx, user)
	if err != nil {
		return "", err
	}
	return "User Registered succesfully", nil
}

func (ar *AuthRepository) FindByEmail(ctx context.Context, email string) (*models.User, error) {
	var user models.User
	err := ar.collection.FindOne(ctx, bson.M{"email": email}).Decode(&user)
	if err != nil {
		return nil, errors.New("User not found")
	}
	return &user, nil
}

func (ar *AuthRepository) FindByUserId(ctx context.Context, id primitive.ObjectID) (*models.User, error) {
	var user models.User
	err := ar.collection.FindOne(ctx, bson.M{"_id": id}).Decode(&user)
	if err != nil {
		return nil, errors.New("User not found")
	}

	return &user, nil
}

func (ar *AuthRepository) UpdateUserProfile(ctx context.Context, id primitive.ObjectID, user *models.User) error {
	update := bson.M{
		"$set": bson.M{
			"profilePic": user.ProfilePic,
		},
	}
	_, err := ar.collection.UpdateByID(ctx, id, update)
	fmt.Println(err)

	if err != nil {
		return errors.New("uer not updated")
	}

	return nil

}

func (ar *AuthRepository) UpdateUserBio(ctx context.Context, id primitive.ObjectID, user *models.User) error {
	update := bson.M{
		"$set": bson.M{
			"bio": user.Bio,
		},
	}
	_, err := ar.collection.UpdateByID(ctx, id, update)
	fmt.Println(err)

	if err != nil {
		return errors.New("uer not updated")
	}

	return nil

}

// GetTotalUsers counts total number of users in the "User" collection.
func (ar *AuthRepository) GetTotalUsers(ctx context.Context) (int, error) {
    // Using context with timeout for safety
    ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
    defer cancel()

    count, err := ar.collection.CountDocuments(ctx, bson.M{})
    if err != nil {
        return 0, err
    }

    return int(count), nil
}
