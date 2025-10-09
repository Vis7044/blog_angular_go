package services

import (
	"context"

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

func (blogservice *BlogService) CreateBlog(ctx context.Context, userId primitive.ObjectID, title, content string ) (string, error) {
	var blog = &models.Blog{
		Id : primitive.NewObjectID(),
		UserId: userId,
		Title: title,
		Content: content,
		Likes: []primitive.ObjectID{},
		Comments: []primitive.ObjectID{},
	}
	return blogservice.blog_repository.CreateBlog(ctx,blog)
}