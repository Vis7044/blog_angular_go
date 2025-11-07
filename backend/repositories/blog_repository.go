package repositories

import (
	"context"

	"github.com/blog_go/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
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
	cursor, err := blogRepository.blogCollection.Find(ctx, bson.D{})
	if err != nil {
		return nil, err
	}

	defer cursor.Close(ctx)
	if err = cursor.All(ctx, &blogs); err != nil {
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

func (blogrepository *BlogRepository) ToggleLikes(ctx context.Context, blogId primitive.ObjectID, userId primitive.ObjectID) (models.Blog, error) {
	var blog models.Blog

	filter1 := bson.M{"_id": blogId}
	filter2 := bson.M{"_id": blogId, "likes": userId}

	// Check if user has already liked this blog
	err := blogrepository.blogCollection.FindOne(ctx, filter2).Decode(&blog)
	if err == mongo.ErrNoDocuments {
		// User hasn't liked yet → add to likes
		_, err := blogrepository.blogCollection.UpdateOne(ctx, filter1, bson.M{
			"$addToSet": bson.M{"likes": userId},
		})
		if err != nil {
			return models.Blog{}, err
		}
	} else if err == nil {
		// User already liked → remove from likes
		_, err := blogrepository.blogCollection.UpdateOne(ctx, filter1, bson.M{
			"$pull": bson.M{"likes": userId},
		})
		if err != nil {
			return models.Blog{}, err
		}
	} else {
		// Some other database error
		return models.Blog{}, err
	}

	// Fetch and return the updated blog
	err = blogrepository.blogCollection.FindOne(ctx, filter1).Decode(&blog)
	if err != nil {
		return models.Blog{}, err
	}

	return blog, nil

}
