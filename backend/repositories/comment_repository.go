package repositories

import (
	"context"
	"time"

	"github.com/blog_go/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type CommentRepository struct {
	commentCollection *mongo.Collection
}

func NewCommentRepository(db *mongo.Database) *CommentRepository {
	return &CommentRepository{
		commentCollection: db.Collection("comments"),
	}
}

func (cr *CommentRepository) CreateComment(ctx context.Context, comment models.Comment) (models.Comment, error) {
	comment.Id = primitive.NewObjectID()
	comment.CreatedAt = primitive.NewDateTimeFromTime(time.Now())
	comment.UpdatedAt = comment.CreatedAt

	_, err := cr.commentCollection.InsertOne(ctx, comment)
	if err != nil {
		return models.Comment{}, err
	}

	return comment, nil
}

/*
Temp: GetCommentsByBlogID
the cursor is a MongoDB cursor — an object that allows you to iterate over the documents returned by your Find query.
This method is part of the MongoDB Go driver (go.mongodb.org/mongo-driver/mongo).
It executes a query on the commentCollection and returns:

A cursor, which points to the documents that match the filter.

An error, if anything went wrong.

Example filter:

bson.M{"blogId": blogId}

means: Find all comments where the blogId field equals the given blogId.
*/
func (cr *CommentRepository) GetCommentsByBlogID(ctx context.Context, blogId primitive.ObjectID) ([]models.Comment, error) {
	var comments []models.Comment

	cursor, err := cr.commentCollection.Find(ctx, bson.M{"blogId": blogId})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var comment models.Comment
		if err := cursor.Decode(&comment); err != nil {
			return nil, err
		}
		comments = append(comments, comment)
	}

	return comments, nil
}
