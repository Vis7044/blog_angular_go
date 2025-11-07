package repositories

import (
	"context"
	"fmt"
	"time"

	"github.com/blog_go/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type BlogRepository struct {
	blogCollection *mongo.Collection
}


func NewBlogRepository(db *mongo.Database) *BlogRepository {
	collection := db.Collection("blogs")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	model := mongo.IndexModel{
		Keys: bson.D{
			{Key: "title", Value: "text"},
			{Key: "content", Value: "text"},
			{Key: "tags", Value: "text"},
		},
	}

	_, err := collection.Indexes().CreateOne(ctx, model)
	if err != nil {
		fmt.Println("Failed to create text index:", err)
	} else {
		fmt.Println("Text index for blogs ensured successfully")
	}

	return &BlogRepository{
		blogCollection: collection,
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

func (r *BlogRepository) SearchBlogs(ctx context.Context, searchQuery string) ([]models.Blog, error) {
	filter := bson.M{
		"$text": bson.M{"$search": searchQuery},
	}
	opts := options.Find().SetProjection(bson.M{
		"score": bson.M{"$meta": "textScore"},
	})
	opts.SetSort(bson.M{"score": bson.M{"$meta": "textScore"}})

	cursor, err := r.blogCollection.Find(ctx, filter, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var blogs []models.Blog
	if err := cursor.All(ctx, &blogs); err != nil {
		return nil, err
	}
	return blogs, nil
}


func (blogRepository *BlogRepository) GetBlogsByDetails(ctx context.Context, blogId primitive.ObjectID) (models.Blog, error) {
	blog := models.Blog{}
	filter := bson.M{"_id": blogId}
	err := blogRepository.blogCollection.FindOne(ctx, filter).Decode(&blog)
	if err != nil {
		return models.Blog{}, err
	}
	return blog, nil
}




