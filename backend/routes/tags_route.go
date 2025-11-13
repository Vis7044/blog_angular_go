package routes

import (
	"github.com/blog_go/controllers"
	"github.com/gin-gonic/gin"
)

func TagsRoute(route *gin.Engine, tagsController *controllers.TagsController) {
	tags := route.Group("/api/tags")
	{
		tags.POST("/bulk", tagsController.InsertInBulk)
		tags.GET("/search", tagsController.GetTags)
	}
}