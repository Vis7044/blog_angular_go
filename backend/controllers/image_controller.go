package controllers

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"path/filepath"

	"github.com/blog_go/config"
	"github.com/blog_go/utils"
	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/gin-gonic/gin"
)

type ImageController struct {
	cld *cloudinary.Cloudinary
}

func NewImageController() *ImageController {
	cld, err := cloudinary.NewFromParams(
		config.Cfg.CloudinaryCloudName,
		config.Cfg.CloudinaryApiKey,
		config.Cfg.CloudinaryApiSecret,
	)
	if err != nil {
		panic("Failed to initialize Cloudinary: " + err.Error())
	}

	return &ImageController{cld: cld}
}

func (imgController *ImageController) UploadImage(c *gin.Context) {
	fmt.Println("UploadImage called")

	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.Response[string]{Success: false, Data: err.Error()})
		return
	}

	// ✅ Use your own app-safe temp directory (cross-platform)
	tempDir := "./temp"
	if _, err := os.Stat(tempDir); os.IsNotExist(err) {
		if err := os.MkdirAll(tempDir, 0755); err != nil {
			c.JSON(http.StatusInternalServerError, utils.Response[string]{Success: false, Data: "Failed to create temp directory"})
			return
		}
	}

	tempPath := filepath.Join(tempDir, file.Filename)

	// ✅ Save uploaded file to your own writable folder
	if err := c.SaveUploadedFile(file, tempPath); err != nil {
		c.JSON(http.StatusInternalServerError, utils.Response[string]{Success: false, Data: err.Error()})
		return
	}
	defer os.Remove(tempPath) // Cleanup after upload

	fileData, err := os.Open(tempPath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.Response[string]{Success: false, Data: "Failed to open file"})
		return
	}
	defer fileData.Close()

	// Upload to Cloudinary (safe)
	uploadResult, err := imgController.cld.Upload.Upload(context.Background(), fileData, uploader.UploadParams{
		Folder: "uploads",
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.Response[string]{Success: false, Data: err.Error()})
		return
	}

	responseData := map[string]string{
		"secureUrl": uploadResult.SecureURL,
		"publicId":  uploadResult.PublicID,
	}

	c.JSON(http.StatusOK, utils.Response[map[string]string]{
		Success: true,
		Data:    responseData,
	})
}

func (imgController *ImageController) DeleteImage(c *gin.Context) {
	var body struct {
		PublicId string `json:"publicId"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid request body",
			"error":   err.Error(),
		})
		return
	}

	if body.PublicId == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Missing publicId field",
		})
		return
	}
	_, err := imgController.cld.Upload.Destroy(context.Background(), uploader.DestroyParams{PublicID: body.PublicId})
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.Response[string]{Success: false, Data: err.Error()})
		return
	}

	c.JSON(http.StatusOK, utils.Response[string]{Success: true, Data: "Image deleted successfully"})
}
