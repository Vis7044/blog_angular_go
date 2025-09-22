package repositories

import (
	"context"
	"errors"
	"time"

	"github.com/blog_go/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type AuthRepository struct {
	collection *mongo.Collection
}

func NewAuthRepository(db *mongo.Database) *AuthRepository {
	return &AuthRepository{
		collection: db.Collection("User"),
	}
}

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
	err := ar.collection.FindOne(ctx,bson.M{"email": email}).Decode(&user)
	if err != nil {
		return nil, errors.New("User not found")
	}
	return &user,nil
}
