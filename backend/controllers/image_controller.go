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

	tempPath := filepath.Join(os.TempDir(), file.Filename)
	if err := c.SaveUploadedFile(file, tempPath); err != nil {
		c.JSON(http.StatusInternalServerError, utils.Response[string]{Success: false, Data: err.Error()})
		return
	}
	defer os.Remove(tempPath)
	fileData, err := os.Open(tempPath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.Response[string]{Success: false, Data: "Failed to open file"})
		return
	}
	defer fileData.Close()

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
	publicId := c.Query("publicId")
	if publicId == "" {
		c.JSON(http.StatusBadRequest, utils.Response[string]{Success: false, Data: "publicId is required"})
		return
	}
	_, err := imgController.cld.Upload.Destroy(context.Background(), uploader.DestroyParams{PublicID: publicId})
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.Response[string]{Success: false, Data: err.Error()})
		return
	}

	c.JSON(http.StatusOK, utils.Response[string]{Success: true, Data: "Image deleted successfully"})
}
