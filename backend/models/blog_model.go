package models

import "go.mongodb.org/mongo-driver/bson/primitive"

/*temp:Think of it like holding a friend’s phone number in your contacts list.

The number itself doesn’t “know” who it belongs to.

Your brain (application logic) knows that “this number belongs to John”.

Similarly, your Go code knows that “these ObjectIDs belong to blogs.”*/

type Status int

const (
	Draft Status = iota
	Published
	Archived
)

type Blog struct {
	Id primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	//Vishal sala yha json me userID me D capital q diya h ??
	UserId     primitive.ObjectID   `bson:"userId" json:"userID"`
	Title      string               `bson:"title" json:"title"`
	Content    string               `bson:"content" json:"content"`
	CoverPhoto string               `bson:"coverPhoto" json:"coverPhoto"`
	Likes      []primitive.ObjectID `bson:"likes" json:"likes"`
	Comments   []primitive.ObjectID `bson:"comments" json:"comments"`
	Status     Status               `bson:"status" json:"status"`
	Tags       []string             `bson:"tags" json:"tags"`
	CreatedAt  primitive.DateTime   `bson:"createdAt,omitempty" json:"createdAt,omitempty"`
	UpdatedAt  primitive.DateTime   `bson:"updatedAt,omitempty" json:"updatedAt,omitempty"`
}
