package controllers

import (
	"fmt"
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
		c.JSON(http.StatusBadRequest, utils.Response[string]{Success: false, Data: err.Error()})
		return
	}
	result, err := ac.service.Register(c.Request.Context(), user)
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.Response[string]{Success: false, Data: err.Error()})
		return
	}
	c.JSON(http.StatusOK, utils.Response[string]{Success: false, Data: result})
}

func (ac *AuthController) Login(ctx *gin.Context) {
	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, utils.Response[string]{Success: false, Data: err.Error()})
	}
	if input.Email == "" || input.Password == "" {
		ctx.JSON(http.StatusBadRequest, utils.Response[string]{Success: false, Data: "Please provice email or password"})
		return
	}
	token, err := ac.service.Login(ctx, input.Email, input.Password)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.Response[string]{Success: false, Data: err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, utils.Response[string]{Success: true, Data: token})

}

/*
Function update the profile pic by taking input UserID/Email
*/

func (as *AuthController) UpdateProfileController(ctx *gin.Context) {
	userId := ctx.Param("id")
	type updateProfilePic struct {
		ProfilePic string `json:"profilePic"`
	}

	var req updateProfilePic

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, utils.Response[string]{Success: false, Data: err.Error()})
		return
	}

	fmt.Println(req.ProfilePic)

	err := as.service.UpdateProfile(ctx, userId, req.ProfilePic)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.Response[string]{Success: false, Data: err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, utils.Response[string]{Success: true, Data: "Profile Pic Added Successfully"})
}
