package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Status int 

const (
	Draft Status = iota
	Published
	Archived
)

type Blog struct {
	Id      primitive.ObjectID      `bson:"_id,omitempty" json:"_id,omitempty"`
	UserId  primitive.ObjectID      `bson:"userId" json:"userID"`
	Title   string                  `bson:"title" json:"title"`
	Content string                  `bson:"content" json:"content"`
	CoverPhoto string               `bson:"coverPhoto" json:"coverPhoto"`
	Likes    []primitive.ObjectID   `bson:"likes" json:"likes"`
	Comments []primitive.ObjectID   `bson:"comments" json:"comments"`
	Status   Status                 `bson:"status" json:"status"`
	Tags	 []string                `bson:"tags" json:"tags"`
	CreatedAt primitive.DateTime     `bson:"createdAt,omitempty" json:"createdAt,omitempty"`
	UpdatedAt primitive.DateTime     `bson:"updatedAt,omitempty" json:"updatedAt,omitempty"`
}
