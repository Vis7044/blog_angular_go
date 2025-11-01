package services

import (
	"context"
	"errors"
	"time"

	"github.com/blog_go/models"
	"github.com/blog_go/repositories"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type BlogService struct {
	blog_repository *repositories.BlogRepository
}

func NewBlogService(r *repositories.BlogRepository) *BlogService {
	return &BlogService{
		blog_repository: r,
	}
}

func (blogservice *BlogService) CreateBlog(ctx context.Context, userId primitive.ObjectID, title, content string, status models.Status, tags []string) (string, error) {
	if title == "" {
		return "", errors.New("title is required")
	}
	if content == "" {
		return "", errors.New("content is required")
	}
	if tags == nil {
		tags = []string{}
	}
	var blog = &models.Blog{
		Id:       primitive.NewObjectID(),
		UserId:   userId,
		Title:    title,
		Content:  content,
		Status:   status,
		Likes:    []primitive.ObjectID{},
		Comments: []primitive.ObjectID{},
		Tags:     tags,
		CreatedAt: primitive.DateTime(time.Now().Unix()),
		UpdatedAt: primitive.DateTime(time.Now().Unix()),
	}
	return blogservice.blog_repository.CreateBlog(ctx, blog)
}

func (blogservice *BlogService) GetAllBlogs(ctx context.Context) ([]models.Blog, error) {
	return blogservice.blog_repository.GetAllBlogs(ctx)
}
