package main

import (
	"time"

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
		AllowOrigins:     []string{"http://localhost:4200"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Initialize layers
	authRepo := repositories.NewAuthRepository(config.DB)
	authService := services.NewAuthService(authRepo)
	authController := controllers.NewAuthController(authService)

	// Register routes
	routes.AuthRoute(r, authController)

	// Run server
	r.Run("127.0.0.1:8080")
}
