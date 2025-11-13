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
	"go.mongodb.org/mongo-driver/mongo/options"
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

// GetTotalUsers counts total number of users in the "User" collection.
func (ar *AuthRepository) GetTotalUsers(ctx context.Context) (int, error) {
	// Using context with timeout for safety
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	count, err := ar.user_collection.CountDocuments(ctx, bson.M{})
	if err != nil {
		return 0, err
	}

	return int(count), nil
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

// StoreResetOTP stores the generated OTP and expiry for a user
func (r *AuthRepository) StoreResetOTP(ctx context.Context, userId primitive.ObjectID, otp string, expiry time.Time) error {
	update := bson.M{
		"$set": bson.M{
			"resetOTP":       otp,
			"resetOTPExpiry": expiry,
		},
	}
	_, err := r.user_collection.UpdateByID(ctx, userId, update)
	if err != nil {
		return fmt.Errorf("failed to store reset OTP: %v", err)
	}
	return nil
}

// VerifyResetOTP checks if OTP is valid and not expired
func (r *AuthRepository) VerifyResetOTP(ctx context.Context, email, otp string) (*models.User, error) {
	var user models.User
	filter := bson.M{
		"email":          email,
		"resetOTP":       otp,
		"resetOTPExpiry": bson.M{"$gt": time.Now()},
	}
	err := r.user_collection.FindOne(ctx, filter).Decode(&user)
	if err != nil {
		return nil, errors.New("invalid or expired OTP")
	}
	return &user, nil
}

// ClearResetOTP clears the OTP after successful verification
func (r *AuthRepository) ClearResetOTP(ctx context.Context, userId primitive.ObjectID) error {
	update := bson.M{
		"$unset": bson.M{
			"resetOTP":       "",
			"resetOTPExpiry": "",
		},
	}
	_, err := r.user_collection.UpdateByID(ctx, userId, update)
	return err
}

func (r *AuthRepository) ResetPasswordByEmail(ctx context.Context, email, hashedPassword string) (string, error) {
	filter := bson.M{"email": email}
	update := bson.M{
		"$set": bson.M{
			"password": hashedPassword,
		},
	}

	_, err := r.user_collection.UpdateOne(ctx, filter, update)
	if err != nil {
		return "", fmt.Errorf("failed to reset password: %v", err)
	}

	return email, nil
}

/*Temp:

opts := options.FindOneAndUpdate().SetReturnDocument(options.After)
Here’s what’s happening:

options.FindOneAndUpdate()
creates a new options struct for the FindOneAndUpdate operation.

.SetReturnDocument(options.After)
tells MongoDB:

“After updating, return the document after the update is applied, not before.”

If you don’t set this, the result would be the document before it was updated.

So this ensures you get the latest updated data right away*/

func (ar *AuthRepository) SavedBlogs(ctx context.Context, blogId primitive.ObjectID, userId primitive.ObjectID) (models.User, error) {
	filter := bson.M{"_id": userId}

	checkFilter := bson.M{"_id": userId, "saved": blogId}

	err := ar.user_collection.FindOne(ctx, checkFilter).Err()

	var update bson.M

	if err == mongo.ErrNoDocuments {
		update = bson.M{"$addToSet": bson.M{"saved": blogId}}
	} else if err == nil {
		update = bson.M{"$pull": bson.M{"saved": blogId}}
	} else {
		return models.User{}, err
	}

	opts := options.FindOneAndUpdate().SetReturnDocument(options.After)
	var updatedUser models.User

	if err := ar.user_collection.FindOneAndUpdate(ctx, filter, update, opts).Decode(&updatedUser); err != nil {
		return models.User{}, err
	}

	return updatedUser, nil

}
