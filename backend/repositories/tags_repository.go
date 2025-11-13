package repositories

import (
	"context"

	"github.com/blog_go/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type TagsRepository struct {
	tagsCollection *mongo.Collection
}

func NewTagsRepository(db *mongo.Database) *TagsRepository {
	return &TagsRepository{
		tagsCollection: db.Collection("tags"),
	}
}

func (tagsRepository *TagsRepository) InsertBulkTags(ctx context.Context, tags []string) error {
	var interfaceTags []interface{}
	for _, tag := range tags {
		interfaceTags = append(interfaceTags, bson.M{"name": tag})
	}
	_, err := tagsRepository.tagsCollection.InsertMany(ctx, interfaceTags)
	return err
}

func (repo *TagsRepository) GetTags(ctx context.Context, query string) ([]models.Tags, error) {
    var tags []models.Tags

    filter := bson.M{
        "name": bson.M{
            "$regex":   query,
            "$options": "i",
        },
    }

    opts := options.Find().SetLimit(10)

    cursor, err := repo.tagsCollection.Find(ctx, filter, opts)
    if err != nil {
        return nil, err
    }
    defer cursor.Close(ctx)

    if err := cursor.All(ctx, &tags); err != nil {
        return nil, err
    }

    return tags, nil
}

