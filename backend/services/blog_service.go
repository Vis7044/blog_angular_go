package services

import (
	"context"
	"errors"
	"strings"
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

func (blogservice *BlogService) CreateBlog(ctx context.Context, userId primitive.ObjectID, title, content string, status models.Status, coverPhoto string, tags []string) (string, error) {
	if title == "" {
		return "", errors.New("title is required")
	}
	if content == "" {
		return "", errors.New("content is required")
	}
	if tags == nil {
		tags = []string{}
	}
	var tempTags []string
	for _, tag := range tags {
		if tag != "" {
			tempTags = append(tempTags, strings.ToLower(strings.TrimSpace(tag)))
		}
	}
	var blog = &models.Blog{
		Id:         primitive.NewObjectID(),
		UserId:     userId,
		Title:      title,
		Content:    content,
		Status:     status,
		Likes:      []primitive.ObjectID{},
		Comments:   []primitive.ObjectID{},
		CoverPhoto: coverPhoto,
		Tags:     tempTags,
		CreatedAt: primitive.DateTime(time.Now().Unix()),
		UpdatedAt: primitive.DateTime(time.Now().Unix()),
	}
	return blogservice.blog_repository.CreateBlog(ctx, blog)
}

func (blogservice *BlogService) GetAllBlogs(ctx context.Context) ([]models.Blog, error) {
	return blogservice.blog_repository.GetAllBlogs(ctx)
}

func (blogservice *BlogService) GetBlogsByDetails(ctx context.Context, id string) (models.Blog, error) {
	blogId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return models.Blog{}, errors.New("invalid blog id")
	}
	return blogservice.blog_repository.GetBlogsByDetails(ctx, blogId)
}

func (blogservice *BlogService) UpdateLike(ctx context.Context, id string, uId string) (models.Blog, error) {
	blogId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return models.Blog{}, errors.New("Like is not updated")
	}
	userId, err := primitive.ObjectIDFromHex(uId)
	if err != nil {
		return models.Blog{}, errors.New("Like is not updated")
	}

	return blogservice.blog_repository.ToggleLikes(ctx, blogId, userId)
}

func (bs *BlogService) SearchBlogs(ctx context.Context, query string) ([]models.Blog, error) {
	return bs.blog_repository.SearchBlogs(ctx, query)
}