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
	user_collection *mongo.Collection
	blog_collection *mongo.Collection
}

func NewAuthRepository(db *mongo.Database) *AuthRepository {
	return &AuthRepository{
		user_collection: db.Collection("User"),
		blog_collection: db.Collection("blogs"),
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
	_, err := ar.user_collection.InsertOne(ctx, user)
	if err != nil {
		return "", err
	}
	return "User Registered succesfully", nil
}

func (ar *AuthRepository) FindByEmail(ctx context.Context, email string) (*models.User, error) {
	var user models.User
	err := ar.user_collection.FindOne(ctx, bson.M{"email": email}).Decode(&user)
	if err != nil {
		return nil, errors.New("User not found")
	}
	return &user, nil
}

func (ar *AuthRepository) FindByUserId(ctx context.Context, id primitive.ObjectID) (*models.User, error) {
	var user models.User
	err := ar.user_collection.FindOne(ctx, bson.M{"_id": id}).Decode(&user)
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
	_, err := ar.user_collection.UpdateByID(ctx, id, update)
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
	_, err := ar.user_collection.UpdateByID(ctx, id, update)
	fmt.Println(err)

	if err != nil {
		return errors.New("uer not updated")
	}

	return nil

}

func (ar *AuthRepository) GetBlogsByUserId(ctx context.Context, userId primitive.ObjectID) ([]models.Blog, error) {
	var blogs []models.Blog
	filter := bson.M{"userId": userId}
	cursor, err := ar.blog_collection.Find(ctx, filter)
	if err != nil {
		return nil, errors.New("could not fetch blogs")
	}
	defer cursor.Close(ctx)
	if err = cursor.All(ctx, &blogs); err != nil {
		return nil, errors.New("error decoding blogs")
	}
	fmt.Println("Blogs fetched for user:", blogs, userId)
	return blogs, nil
}