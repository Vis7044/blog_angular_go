package routes

import (
	"github.com/blog_go/controllers"
	"github.com/blog_go/middleware"
	"github.com/gin-gonic/gin"
)

func CommentRoute(r *gin.Engine, commentController *controllers.CommentController) {
	comment := r.Group("/api/blogs/comments")
	{
		comment.GET("allcomment/:id", middleware.AuthMiddleware(), commentController.GetComments)
		comment.POST("addcomment/:id", middleware.AuthMiddleware(), commentController.AddComment)
	}
}
