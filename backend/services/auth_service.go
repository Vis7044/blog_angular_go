package services

import (
	"context"
	"errors"

	"github.com/blog_go/models"
	"github.com/blog_go/repositories"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	repo *repositories.AuthRepository
}

func NewAuthService(r *repositories.AuthRepository) *AuthService {
	return &AuthService{
		repo: r,
	}
}

func (as *AuthService) Register(ctx context.Context, user models.User) (string, error) {
	user.Id = primitive.NewObjectID();
	if user.Username == "" {
    return "", errors.New("username is required")
	}
	if user.Email == "" {
		return "", errors.New("email is required")
	}
	if user.Password == "" {
		return "", errors.New("password is required")
	}
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	user.Password = string(hashedPassword)

	return as.repo.Register(ctx,user)
}
