package main

import (
	"net/http"
	"github.com/blog_go/config"
	"github.com/gin-gonic/gin"
)

func main() {
	config.LoadConfig()
	config.ConnectDb()
	r := gin.Default()

	r.GET("/", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{"message":"hello"})
	})

	r.Run("127.0.0.1:8080")
	defer config.DisconnectDatabase()
}