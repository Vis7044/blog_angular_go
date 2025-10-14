package repositories

import (
	"context"
	"github.com/blog_go/models"
	"go.mongodb.org/mongo-driver/bson"
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

func (blogRepository *BlogRepository) GetAllBlogs(ctx context.Context) ([]models.Blog, error) {
	blogs := []models.Blog{}
	cursor, err := blogRepository.blogCollection.Find(ctx, bson.D{});
	if err != nil {
		return nil, err
	}

	defer cursor.Close(ctx)
	if err = cursor.All(ctx, &blogs); err != nil {
		return nil, err
	}
	return blogs, nil
}




