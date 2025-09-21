package routes

import (
	"github.com/blog_go/controllers"
	"github.com/gin-gonic/gin"
)

func AuthRoute(r *gin.Engine, authController *controllers.AuthController) {
	user := r.Group("/auth") 
	{
		user.GET("/register", authController.RegisterController)
	}
}