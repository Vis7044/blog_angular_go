package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type User struct {
	Id primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Username string `bson:"username" json:"username"`
	ProfilePic string `bson:"profilePic" json:"profilePic"`
	Email string `bson:"email" json:"email"`
	Password string `bson:"password" json:"password"`
}