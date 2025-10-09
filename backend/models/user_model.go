package models

import "go.mongodb.org/mongo-driver/bson/primitive"

/*
Temp: In Go struct tags (like bson or json), the omitempty option means:
👉 "Skip this field when encoding if it has the zero value."
*/

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
}
