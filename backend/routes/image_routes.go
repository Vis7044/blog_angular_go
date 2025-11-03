package routes

import (
	"github.com/blog_go/controllers"
	"github.com/blog_go/middleware"
	"github.com/gin-gonic/gin"
)

func ImageRoute(route *gin.Engine, imageController *controllers.ImageController) {
	image := route.Group("/api/images")
	{
		image.POST("/upload", middleware.AuthMiddleware(),imageController.UploadImage)
		image.DELETE("/delete",middleware.AuthMiddleware(), imageController.DeleteImage)
	}
}