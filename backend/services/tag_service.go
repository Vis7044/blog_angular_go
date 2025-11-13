package services

import (
	"context"

	"github.com/blog_go/models"
	"github.com/blog_go/repositories"
)

type TagsService struct {
	tag_repository *repositories.TagsRepository
}

func NewTagService(tagRespository *repositories.TagsRepository) *TagsService {
	return &TagsService{
		tag_repository: tagRespository,
	}
}

func (tagsService *TagsService) InsertBulkTags(ctx context.Context, tags []string) error {
	return tagsService.tag_repository.InsertBulkTags(ctx, tags)
}

func (tagsService *TagsService) GetTags(ctx context.Context, query string) ([]models.Tags, error) {
	return tagsService.tag_repository.GetTags(ctx, query)
}