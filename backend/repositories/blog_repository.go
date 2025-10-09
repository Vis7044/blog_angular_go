package repositories

import (
	"context"

	"github.com/blog_go/models"
	"go.mongodb.org/mongo-driver/mongo"
)

type BlogRepository struct {
	blogCollection *mongo.Collection
}

func NewBlogRepository(db *mongo.Database) *BlogRepository {
	return &BlogRepository{
		blogCollection: db.Collection("blogs"),
	}
}

func (blogRepository *BlogRepository) CreateBlog(ctx context.Context, blog *models.Blog) (string, error) {
	_, err := blogRepository.blogCollection.InsertOne(ctx, blog) 
	if err != nil {
		return "", err
	}
	return "Blog created successfully", nil
}





