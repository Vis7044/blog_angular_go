package main

import (
	"github.com/blog_go/config"
	"github.com/blog_go/controllers"
	"github.com/blog_go/repositories"
	"github.com/blog_go/routes"
	"github.com/blog_go/services"
	"github.com/gin-gonic/gin"
)

func main() {
	config.LoadConfig()
	config.ConnectDb()
	r := gin.Default()

	authRepo := repositories.NewAuthRepository(config.DB)
	authService := services.NewAuthService(authRepo)
	authController := controllers.NewAuthController(authService)
	routes.AuthRoute(r, authController)

	r.Run("127.0.0.1:8080")
	defer config.DisconnectDatabase()
}