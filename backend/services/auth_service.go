package services

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/blog_go/config"
	"github.com/blog_go/models"
	"github.com/blog_go/repositories"
	"github.com/golang-jwt/jwt"
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


func (as *AuthService) Login(ctx context.Context, email, password string) (string, error) {
	user, err := as.repo.FindByEmail(ctx,email)
	if err != nil {
		return "", errors.New("invalid credentials")
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return "", errors.New("invalid credentials")
	}
	claims := jwt.MapClaims {
		"userId": user.Id.Hex(),
		"email": user.Email,
		"exp":time.Now().Add(time.Hour * 2).Unix(),
		"iat":time.Now().Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256,claims)
	jwtSecret := config.Cfg.Jwt_secret
	fmt.Println(jwtSecret)
	return token.SignedString([]byte(jwtSecret))
}