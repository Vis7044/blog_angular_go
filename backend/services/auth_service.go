package services

import (
	"context"
	"errors"
	"time"

	"github.com/blog_go/config"
	"github.com/blog_go/models"
	"github.com/blog_go/repositories"
	"github.com/blog_go/utils"
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
	user.Id = primitive.NewObjectID()
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

	return as.repo.Register(ctx, user)
}

func (as *AuthService) Login(ctx context.Context, email, password string) (string,string, error) {
    user, err := as.repo.FindByEmail(ctx, email)
    if err != nil {
        return "", "", errors.New("invalid credentials")
    }

    if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
        return "", "", errors.New("invalid credentials")
    }

    
    accessClaims := jwt.MapClaims{
        "userId": user.Id.Hex(),
        "email":  user.Email,
        "isAdmin": user.IsAdmin,
        "exp":    time.Now().Add(30 * time.Minute).Unix(),
        "iat":    time.Now().Unix(),
    }

    accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims)
    accessTokenString, err := accessToken.SignedString([]byte(config.Cfg.Jwt_secret))
    if err != nil {
        return "", "", err
    }


    refreshClaims := jwt.MapClaims{
        "userId": user.Id.Hex(),
        "email":  user.Email,
        "isAdmin": user.IsAdmin,
        "exp":    time.Now().Add(7 * 24 * time.Hour).Unix(),
        "iat":    time.Now().Unix(),
    }

    refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims)
    refreshTokenString, err := refreshToken.SignedString([]byte(config.Cfg.RefreshToken_secret))
    if err != nil {
        return "", "", err
    }
    return accessTokenString, refreshTokenString, nil
}


func (as *AuthService) UpdateProfile(ctx context.Context, idstr string, profilePic string) error {
	id, err := primitive.ObjectIDFromHex(idstr)
	if err != nil {
		return errors.New("Invalid Id")
	}

	user, errs := as.repo.FindByUserId(ctx, id)
	if errs != nil {
		return errors.New("No user found")
	}
	user.ProfilePic = profilePic
	errs = as.repo.UpdateUserProfile(ctx, id, user)

	return errs
}

func (as *AuthService) Updatebio(ctx context.Context, idstr string, bio string) error {
	id, err := primitive.ObjectIDFromHex(idstr)
	if err != nil {
		return errors.New("Invalid Id")
	}
	user, errs := as.repo.FindByUserId(ctx, id)

	if errs != nil {
		return errors.New("No user found")
	}
	user.Bio = bio
	errs = as.repo.UpdateUserBio(ctx, id, user)
	return errs
}


func (as *AuthService) RefreshTokens(ctx context.Context, refreshTokenStr string) (string, error) {
	if refreshTokenStr == "" {
		return "", errors.New("refresh token is required")
	}
	claims, err := utils.ParseRefreshToken(refreshTokenStr)
	if err != nil {
		return "", errors.New("invalid or expired refresh token")
	}
	accessClaims := jwt.MapClaims{
		"userId": claims["userId"],
		"email":  claims["email"],
		"isAdmin": claims["isAdmin"],
		"exp":    time.Now().Add(30 * time.Minute).Unix(),
		"iat":    time.Now().Unix(),
	}

	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims)
	accessTokenString, err := accessToken.SignedString([]byte(config.Cfg.Jwt_secret))
	if err != nil {
		return "", err
	}

	return accessTokenString, nil
}

func (as *AuthService) GetLoggedInUser(ctx context.Context, email string) (models.User, error) {
	user, err := as.repo.FindByEmail(ctx, email)
	if err != nil {
		return models.User{}, errors.New("user not found")
	}
	return *user, nil
}

func (as *AuthService) GetAllBlogsByUserId(ctx context.Context, id string) ([]models.Blog, error) {
	userId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, errors.New("invalid user id")
	}
	blogs, err := as.repo.GetBlogsByUserId(ctx, userId)
	if err != nil {
		return nil, errors.New("could not fetch blogs for user")
	}
	return blogs, nil
}