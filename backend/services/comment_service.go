package services

import (
	"context"
	"errors"

	"github.com/blog_go/models"
	"github.com/blog_go/repositories"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type CommentService struct {
	commentRepo *repositories.CommentRepository
}

func NewCommentService(commentRepo *repositories.CommentRepository) *CommentService {
	return &CommentService{commentRepo: commentRepo}
}

func (cs *CommentService) AddComment(ctx context.Context, blogIDStr string, userIDStr string, content string) (models.Comment, error) {
	if content == "" {
		return models.Comment{}, errors.New("content cannot be empty")
	}

	blogID, err := primitive.ObjectIDFromHex(blogIDStr)
	if err != nil {
		return models.Comment{}, errors.New("invalid blog id")
	}

	userID, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		return models.Comment{}, errors.New("invalid user id")
	}

	comment := models.Comment{
		BlogId:         blogID,
		UserId:         userID,
		CommentContent: content,
	}

	return cs.commentRepo.CreateComment(ctx, comment)
}

func (cs *CommentService) GetComments(ctx context.Context, blogIdStr string) ([]models.Comment, error) {
	blogId, err := primitive.ObjectIDFromHex(blogIdStr)

	if err != nil {
		return nil, errors.New("Invalid Blog Id")
	}

	return cs.commentRepo.GetCommentsByBlogID(ctx, blogId)
}
