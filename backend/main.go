package main

import (
	"github.com/blog_go/config"
	"github.com/blog_go/controllers"
	"github.com/blog_go/repositories"
	"github.com/blog_go/routes"
	"github.com/blog_go/services"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Load environment variables
	config.LoadConfig()

	// Connect to database
	config.ConnectDb()
	defer config.DisconnectDatabase()

	// Initialize router
	r := gin.Default()

	// Allow CORS for Angular frontend
	r.Use(cors.Default())

	// Initialize layers
	authRepo := repositories.NewAuthRepository(config.DB)
	authService := services.NewAuthService(authRepo)
	authController := controllers.NewAuthController(authService)

	imageController := controllers.NewImageController()
	// Register routes
	routes.AuthRoute(r, authController)
	routes.ImageRoute(r, imageController)

	// Run server
	r.Run("127.0.0.1:8080")
}
