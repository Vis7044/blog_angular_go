package models

import "go.mongodb.org/mongo-driver/bson/primitive"

/*temp:Think of it like holding a friend’s phone number in your contacts list.

The number itself doesn’t “know” who it belongs to.

Your brain (application logic) knows that “this number belongs to John”.

Similarly, your Go code knows that “these ObjectIDs belong to blogs.”*/

type Blog struct {
	Id      primitive.ObjectID `bson:"_id",omitempty json:"_id",omitempty`
	UserId  primitive.ObjectID `bson:"userId" json:"userID"`
	Title   string             `bson:"title" json:"title"`
	Content string             `bson:"content" json:"content"`
	Like    int                `bson:"like" json:"like"`
	Comment primitive.ObjectID `bson:"commentId",omitempty json:"commentId",omitempty`
}
