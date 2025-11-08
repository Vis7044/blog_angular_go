package models

import (
	"time"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	Id         primitive.ObjectID   `bson:"_id,omitempty" json:"id,omitempty"`
	Username   string               `bson:"username" json:"username"`
	ProfilePic string               `bson:"profilePic" json:"profilePic"`
	Email      string               `bson:"email" json:"email" binding:"required"`
	Password   string               `bson:"password" json:"password" binding:"required"`
	Name       string               `bson:"name" json:"name" binding:"required"`
	Bio        string               `bson:"bio" json:"bio"`
	IsAdmin    bool                 `bson:"isAdmin" json:"isAdmin"`
	Saved      []primitive.ObjectID `bson:"blogId",omitempty json:"blogId",omitempty`
	ResetOTP         string             `bson:"resetOTP,omitempty" json:"-"`
    ResetOTPExpiry   time.Time          `bson:"resetOTPExpiry,omitempty" json:"-"`

}

type UserResponse struct {
	Id         primitive.ObjectID   `bson:"_id,omitempty" json:"id,omitempty"`
	Username   string               `bson:"username" json:"username"`
	ProfilePic string               `bson:"profilePic" json:"profilePic"`
	Email      string               `bson:"email" json:"email"`
	Name       string               `bson:"name" json:"name"`
	Bio        string               `bson:"bio" json:"bio"`
	IsAdmin    bool                 `bson:"isAdmin" json:"isAdmin"`
	Saved      []primitive.ObjectID `bson:"blogId",omitempty json:"blogId",omitempty`
}