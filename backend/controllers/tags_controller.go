package controllers

import (
	"github.com/blog_go/models"
	"github.com/blog_go/services"
	"github.com/blog_go/utils"
	"github.com/gin-gonic/gin"
)

type TagsController struct {
	tagsService *services.TagsService
}

func NewTagsController(tagsService *services.TagsService) *TagsController {
	return &TagsController{
		tagsService: tagsService,
	}
}

func (tagsController *TagsController) InsertInBulk(ctx *gin.Context) {
	var Input struct {
		Tags []string `json:"tags"`
	}
	if err := ctx.ShouldBindBodyWithJSON(&Input); err != nil {
		ctx.JSON(400, utils.Response[string]{Success: false, Data: "Invalid input: " + err.Error()})
		return
	}
	tagsController.tagsService.InsertBulkTags(ctx, Input.Tags)
	ctx.JSON(200, utils.Response[string]{Success: true, Data: "Tags inserted successfully"}	)
}

func (tagsController *TagsController) GetTags(ctx *gin.Context) {
	query := ctx.Query("q")
	tags, err := tagsController.tagsService.GetTags(ctx, query)
	if err != nil {
		ctx.JSON(500, utils.Response[string]{Success: false, Data: "Failed to fetch tags: " + err.Error()})
		return
	}
	ctx.JSON(200, utils.Response[[]models.Tags]{Success: true, Data: tags})
}