package routes

import (
	"github.com/blog_go/controllers"
	"github.com/blog_go/middleware"
	"github.com/gin-gonic/gin"
)

func BlogRoute(r *gin.Engine, blogController *controllers.BlogController) {
	blog := r.Group("/api/blogs") 
	{
		blog.POST("/", middleware.AuthMiddleware(),blogController.CreateBlogController)
	}
}