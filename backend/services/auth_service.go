package services

import (
	"context"
	"crypto/rand"
	"errors"
	"fmt"
	"math/big"
	"strconv"
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
	if user.Name == "" {
		return "", errors.New("Name is required")
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
	user.Username, err = as.GetUserName(user.Name, ctx)
	if err != nil {
		return "", err
	}
	fmt.Println("UserName is : " + user.Username)

	return as.repo.Register(ctx, user)
}

func (as *AuthService) Login(ctx context.Context, email, password string) (string, string, error) {
	user, err := as.repo.FindByEmail(ctx, email)
	if err != nil {
		return "", "", errors.New("invalid credentials")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return "", "", errors.New("invalid credentials")
	}

	accessClaims := jwt.MapClaims{
		"userId":  user.Id.Hex(),
		"email":   user.Email,
		"isAdmin": user.IsAdmin,
		"exp":     time.Now().Add(30 * time.Minute).Unix(),
		"iat":     time.Now().Unix(),
	}

	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims)
	accessTokenString, err := accessToken.SignedString([]byte(config.Cfg.Jwt_secret))
	if err != nil {
		return "", "", err
	}

	refreshClaims := jwt.MapClaims{
		"userId":  user.Id.Hex(),
		"email":   user.Email,
		"isAdmin": user.IsAdmin,
		"exp":     time.Now().Add(7 * 24 * time.Hour).Unix(),
		"iat":     time.Now().Unix(),
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

/*
This function is converting name into unique username suppose name is rahul then first 3 letter of rahul plus total user till but in
Four digits so the username will be Rah+0001=Rah001
*/
func (as *AuthService) GetUserName(name string, ctx context.Context) (string, error) {
	totalUser, err := as.repo.GetTotalUsers(ctx)

	if err != nil {
		return "", err
	}

	var increment string = "0000" + strconv.Itoa(totalUser)

	return name[:3] + increment[len(increment)-4:], nil
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
		"userId":  claims["userId"],
		"email":   claims["email"],
		"isAdmin": claims["isAdmin"],
		"exp":     time.Now().Add(30 * time.Minute).Unix(),
		"iat":     time.Now().Unix(),
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

func generateOTP() string {
	max := big.NewInt(1000000)
	n, err := rand.Int(rand.Reader, max)
	if err != nil {
		return "000000"
	}
	return fmt.Sprintf("%06d", n.Int64())
}

func (as *AuthService) GenerateAndSendOTP(ctx context.Context, email string) error {
	user, err := as.repo.FindByEmail(ctx, email)
	if err != nil {
		return errors.New("user with given email does not exist")
	}

	otp := generateOTP()
	expiry := time.Now().Add(10 * time.Minute)

	// Store OTP in DB
	err = as.repo.StoreResetOTP(ctx, user.Id, otp, expiry)
	if err != nil {
		return errors.New("failed to store OTP: " + err.Error())
	}

	// Send email via Brevo
	brevoService := NewBrevoService("Burogo Support", config.Cfg.BrevoEmail)
	err = brevoService.SendTemplateEmail(
		user.Email,
		user.Name,
		6,
		map[string]interface{}{
			"name": user.Name,
			"otp":  otp,
		},
	)
	if err != nil {
		return fmt.Errorf("failed to send OTP email: %v", err)
	}

	return nil
}

func (as *AuthService) HandleVerifyOTP(ctx context.Context, email, otp string) error {
	// Validate inputs
	if email == "" || otp == "" {
		return errors.New("email, otp are required")
	}

	// Verify OTP (repository handles lookup and expiry)
	user, err := as.repo.VerifyResetOTP(ctx, email, otp)
	if err != nil {
		return err
	}
	// Clear OTP fields
	if err := as.repo.ClearResetOTP(ctx, user.Id); err != nil {
		fmt.Println("Warning: failed to clear OTP:", err)
	}

	return nil
}

func (as *AuthService) ResetPassword(ctx context.Context, newPassword string, email string) (string, error) {
	if len(newPassword) < 6 {
		return "", errors.New("password must be at least 6 characters")
	}
	hashedPassword, err := utils.HashPassword(newPassword)
	if err != nil {
		return "", errors.New("failed to hash password")
	}
	userEmail, err := as.repo.ResetPasswordByEmail(ctx, email, hashedPassword)
	if err != nil {
		return "", err
	}

	return userEmail, nil
}

func (as *AuthService) SavedBlogs(ctx context.Context, blogIdStr string, userIdStr string) (models.User, error) {
	blogId, err := primitive.ObjectIDFromHex(blogIdStr)
	if err != nil {
		return models.User{}, errors.New("invalid blog id")
	}

	userId, err := primitive.ObjectIDFromHex(userIdStr)
	if err != nil {
		return models.User{}, errors.New("invalid user id")
	}

	return as.repo.SavedBlogs(ctx, blogId, userId)
}
