package services

import (
	"context"
	"errors"
	"fmt"
	"time"
	"strconv"

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
	user.Username,err =as.GetUserName(user.Name,ctx)
	if err != nil {
		return "", err
	}
	fmt.Println("UserName is : "+user.Username)

	return as.repo.Register(ctx, user)
}

func (as *AuthService) Login(ctx context.Context, email, password string) (string, error) {
	user, err := as.repo.FindByEmail(ctx, email)
	if err != nil {
		return "", errors.New("invalid credentials")
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return "", errors.New("invalid credentials")
	}
	claims := jwt.MapClaims{
		"userId": user.Id.Hex(),
		"email":  user.Email,
		"exp":    time.Now().Add(time.Hour * 2).Unix(),
		"iat":    time.Now().Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	jwtSecret := config.Cfg.Jwt_secret
	fmt.Println(jwtSecret)
	return token.SignedString([]byte(jwtSecret))
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
	fmt.Println("Bio", user.Bio)
	errs = as.repo.UpdateUserBio(ctx, id, user)
	return errs
}

/*This function is converting name into unique username suppose name is rahul then first 3 letter of rahul plus total user till but in 
Four digits so the username will be Rah+0001=Rah001*/
func (as *AuthService) GetUserName(name string,ctx context.Context) (string,error){
	totalUser,err:=as.repo.GetTotalUsers(ctx)

	if err!=nil{
		return "",err
	}

	var increment string="0000"+strconv.Itoa(totalUser)

	return name[:3]+increment[len(increment)-4:],nil
}
