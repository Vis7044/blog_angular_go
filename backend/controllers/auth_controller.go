package controllers

import (
	"net/http"
	"github.com/blog_go/models"
	"github.com/blog_go/services"
	"github.com/blog_go/utils"
	"github.com/gin-gonic/gin"
)

type AuthController struct {
	service *services.AuthService
}

func NewAuthController(s *services.AuthService) *AuthController {
	return &AuthController{
		service: s,
	}
}

func (ac *AuthController) RegisterController(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, utils.Response[string]{Success: false,Data: err.Error()})
		return
	}
	result, err := ac.service.Register(c.Request.Context(),user)
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.Response[string]{Success: false,Data: err.Error()})
		return
	}
	c.JSON(http.StatusOK, utils.Response[string]{Success: false,Data: result})
}