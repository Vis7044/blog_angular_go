package controllers

import (
	"net/http"

	"github.com/blog_go/models"
	"github.com/blog_go/services"
	"github.com/blog_go/utils"
	"github.com/gin-gonic/gin"
)

type CommentController struct {
	commentService *services.CommentService
}

func NewCommentController(commentService *services.CommentService) *CommentController {
	return &CommentController{commentService: commentService}
}

func (cc *CommentController) AddComment(ctx *gin.Context) {
	blogId := ctx.Param("id")

	userID, exists := ctx.Get("userId")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var req struct {
		CommentContent string `json:"commentContent"`
	}

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	comment, err := cc.commentService.AddComment(ctx, blogId, userID.(string), req.CommentContent)
	if err != nil {

		ctx.JSON(http.StatusBadRequest, utils.Response[string]{Success: false, Data: err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, utils.Response[models.Comment]{Success: true, Data: comment})
}

func (cc *CommentController) GetComments(ctx *gin.Context) {
	blogId := ctx.Param("id")

	comments, err := cc.commentService.GetComments(ctx, blogId)
	if err != nil {

		ctx.JSON(http.StatusBadRequest, utils.Response[string]{Success: false, Data: err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, utils.Response[[]models.Comment]{Success: true, Data: comments})

}
