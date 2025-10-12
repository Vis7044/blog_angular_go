package routes

import (
	"github.com/blog_go/controllers"
	"github.com/gin-gonic/gin"
)

func AuthRoute(r *gin.Engine, authController *controllers.AuthController) {
	user := r.Group("/api/auth")
	{
		user.POST("/register", authController.RegisterController)
		user.POST("/login", authController.Login)
		user.PATCH("/updateprofile/:id", authController.UpdateProfileController)
	}
}
