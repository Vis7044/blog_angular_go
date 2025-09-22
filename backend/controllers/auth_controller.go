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

func (ac *AuthController) Login(ctx *gin.Context) {
	var input struct {
		Email string `json:"email"`
		Password string `json:"password"`
	}
	if err := ctx.ShouldBindJSON(&input);err != nil {
		ctx.JSON(http.StatusBadRequest,utils.Response[string]{Success: false,Data: err.Error()})
	}
	if input.Email=="" || input.Password== "" {
		ctx.JSON(http.StatusBadRequest, utils.Response[string]{Success:false,Data: "Please provice email or password"})
		return
	}
	token, err := ac.service.Login(ctx,input.Email,input.Password)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.Response[string]{Success:false,Data: err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, utils.Response[string]{Success: true, Data: token})

}