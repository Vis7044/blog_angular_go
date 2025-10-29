package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type RefreshTokenRequest struct {
	Token  string `json:"token" binding:"required"`
	UserId primitive.ObjectID `json:"userId" binding:"required"`
	
}