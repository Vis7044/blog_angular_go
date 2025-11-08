package controllers

import (
	"github.com/blog_go/models"
	"github.com/blog_go/services"
	"github.com/blog_go/utils"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type BlogController struct {
	blogService *services.BlogService
}

func NewBlogController(blogService *services.BlogService) *BlogController {
	return &BlogController{
		blogService: blogService,
	}
}

func (blogController *BlogController) CreateBlogController(ctx *gin.Context) {
	userId, exists := ctx.Get("userId")
	id := ctx.Query("id")
	if !exists {
		ctx.AbortWithStatusJSON(401, utils.Response[string]{Success: false, Data: "Unauthorized"})
		return
	}

	userIdStr, ok := userId.(string)
	if !ok {
		ctx.AbortWithStatusJSON(500, utils.Response[string]{Success: false, Data: "Invalid user ID"})
		return
	}
	userObjectID, err := primitive.ObjectIDFromHex(userIdStr)
	if err != nil {
		ctx.JSON(400, utils.Response[string]{Success: false, Data: "Invalid user ID"})
		return
	}

	var blogInput struct {
		Title      string        `json:"title" binding:"required"`
		Content    string        `json:"content" binding:"required"`
		Status     models.Status `json:"status"`
		CoverPhoto string        `json:"coverPhoto"`
		Tags       []string      `json:"tags"`
	}
	if err := ctx.ShouldBindJSON(&blogInput); err != nil {
		ctx.JSON(400, utils.Response[string]{Success: false, Data: "Invalid input: " + err.Error()})
		return
	}

	message, err := blogController.blogService.CreateBlog(ctx.Request.Context(), userObjectID, blogInput.Title, blogInput.Content, blogInput.Status, blogInput.CoverPhoto, blogInput.Tags, id)
	if err != nil {
		ctx.JSON(500, utils.Response[string]{Success: false, Data: "Failed to create blog: " + err.Error()})
		return
	}

	ctx.JSON(200, utils.Response[string]{Success: true, Data: message})
}

func (blogController *BlogController) GetAllBlogsController(ctx *gin.Context) {
	var blogs []models.Blog
	blogs, err := blogController.blogService.GetAllBlogs(ctx.Request.Context())
	if err != nil {
		ctx.JSON(500, utils.Response[string]{Success: false, Data: "Failed to fetch blogs: " + err.Error()})
		return
	}
	ctx.JSON(200, utils.Response[[]models.Blog]{Success: true, Data: blogs})
}

func (bc *BlogController) SearchBlogsController(ctx *gin.Context) {
	query := ctx.Query("q")
	if query == "" {
		ctx.JSON(400, utils.Response[string]{Success: false, Data: "Search query required"})
		return
	}

	blogs, err := bc.blogService.SearchBlogs(ctx.Request.Context(), query)
	if err != nil {
		ctx.JSON(500, utils.Response[string]{Success: false, Data: "Failed to search blogs: " + err.Error()})
		return
	}

	ctx.JSON(200, utils.Response[[]models.Blog]{Success: true, Data: blogs})
}

func (blogController *BlogController) GetBlogsByDetailsController(ctx *gin.Context) {
	blogId := ctx.Param("id")
	blog, err := blogController.blogService.GetBlogsByDetails(ctx.Request.Context(), blogId)
	if err != nil {
		ctx.JSON(500, utils.Response[string]{Success: false, Data: "Failed to fetch blog details: " + err.Error()})
		return
	}
	ctx.JSON(200, utils.Response[models.Blog]{Success: true, Data: blog})
}

func (blogController *BlogController) LikeBlogController(ctx *gin.Context) {
	blogId := ctx.Param("id")

	userIDStr, exists := ctx.Get("userId")

	if !exists {
		ctx.AbortWithStatusJSON(401, utils.Response[string]{Success: false, Data: "Unauthorized"})
		return
	}

	blog, err := blogController.blogService.UpdateLike(ctx, blogId, userIDStr.(string))
	if err != nil {
		ctx.JSON(500, utils.Response[string]{Success: false, Data: "Failed to update like: " + err.Error()})
		return
	}
	ctx.JSON(200, utils.Response[models.Blog]{Success: true, Data: blog})
}
