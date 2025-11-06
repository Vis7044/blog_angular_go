package routes

import (
	"github.com/blog_go/controllers"
	"github.com/blog_go/middleware"
	"github.com/gin-gonic/gin"
)

func AuthRoute(r *gin.Engine, authController *controllers.AuthController) {
	user := r.Group("/api/auth")
	{
		user.POST("/register", authController.RegisterController)
		user.POST("/login", authController.Login)
		user.POST("/logout", middleware.AuthMiddleware(),authController.Logout)
		user.GET("/logedinuser", middleware.AuthMiddleware() ,authController.LoggedInUserController)
		user.PATCH("/updateprofile/:id", authController.UpdateProfileController)
		user.PATCH("/updatebio/:id", authController.UpdateProfileBio)
		user.POST("refresh-token", authController.RefreshToken)
		user.GET("/allblogs", middleware.AuthMiddleware(),authController.GetAllBlogsOfUser)
	}
}
