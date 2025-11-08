package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Comment struct {
	Id             primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	BlogId         primitive.ObjectID `bson:"blogId" json:"blogId"`
	UserId         primitive.ObjectID `bson:"userId" json:"userID"`
	CommentContent string             `bson:"commentContent" json:"commentContent"`
	CreatedAt      primitive.DateTime `bson:"createdAt" json:"createdAt"`
	UpdatedAt      primitive.DateTime `bson:"updatedAt" json:"updatedAt"`
}
