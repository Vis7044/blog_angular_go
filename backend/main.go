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
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://127.0.0.1:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * 60 * 60,
	}))

	// Initialize layers
	authRepo := repositories.NewAuthRepository(config.DB)
	authService := services.NewAuthService(authRepo)
	authController := controllers.NewAuthController(authService)

	// Initialize image controller
	imageController := controllers.NewImageController()

	// Initialize blog controller
	blogRepo := repositories.NewBlogRepository(config.DB)
	blogService := services.NewBlogService(blogRepo)
	blogController := controllers.NewBlogController(blogService)

	// Register routes
	routes.AuthRoute(r, authController)
	routes.ImageRoute(r, imageController)
	routes.BlogRoute(r, blogController)

	// Run server
	r.Run("127.0.0.1:8080")
}
