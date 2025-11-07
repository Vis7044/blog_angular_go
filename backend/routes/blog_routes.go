package routes

import (
	"github.com/blog_go/controllers"
	"github.com/blog_go/middleware"
	"github.com/gin-gonic/gin"
)

func BlogRoute(r *gin.Engine, blogController *controllers.BlogController) {
	blog := r.Group("/api/blogs") 
	{
		blog.GET("", blogController.GetAllBlogsController)
		blog.POST("", middleware.AuthMiddleware(), blogController.CreateBlogController)
		blog.GET("/:id", blogController.GetBlogsByDetailsController)	
		blog.GET("/search", blogController.SearchBlogsController)
	}
}