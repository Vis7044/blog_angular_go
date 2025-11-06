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
	c.JSON(http.StatusOK, utils.Response[string]{Success: true, Data: result})
}

func (ac *AuthController) Login(ctx *gin.Context) {
    var input struct {
        Email    string `json:"email"`
        Password string `json:"password"`
    }
    
    if err := ctx.ShouldBindJSON(&input); err != nil {
        ctx.JSON(http.StatusBadRequest, utils.Response[string]{Success: false, Data: err.Error()})
        return
    }
    
    if input.Email == "" || input.Password == "" {
        ctx.JSON(http.StatusBadRequest, utils.Response[string]{Success: false, Data: "Please provide email or password"})
        return
    }
    
    access_token, refresh_token, err := ac.service.Login(ctx, input.Email, input.Password)
    if err != nil {
        ctx.JSON(http.StatusBadRequest, utils.Response[string]{Success: false, Data: err.Error()})
        return
    }
    
    // Use Gin's SetCookie method
    ctx.SetCookie(
        "accessToken",           // name
        access_token,            // value
        15*60,                   // maxAge (seconds)
        "/",                     // path
        "",                      // domain (empty = current domain)
        false,                   // secure (set true in production)
        true,                    // httpOnly
    )
    
    ctx.SetCookie(
        "refreshToken",
        refresh_token,
        7*24*60*60,              // 7 days
        "/",
        "",
        false,                   // secure (set true in production)
        true,                    // httpOnly
    )
    ctx.JSON(http.StatusOK, utils.Response[string]{Success: true, Data: "Login successful"})
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

	err := as.service.UpdateProfile(ctx, userId, req.ProfilePic)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.Response[string]{Success: false, Data: err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, utils.Response[string]{Success: true, Data: "Profile Pic Added Successfully"})
}

func (as *AuthController) UpdateProfileBio(ctx *gin.Context) {
	userId := ctx.Param("id")
	type bioStatus struct {
		Bio string `json:"bio"`
	}

	var req bioStatus

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, utils.Response[string]{Success: false, Data: err.Error()})
		return
	}
	fmt.Println("working: ", req.Bio)

	err := as.service.Updatebio(ctx, userId, req.Bio)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.Response[string]{Success: false, Data: err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, utils.Response[string]{Success: true, Data: "Bio updated successfully"})

}

func (ac *AuthController) RefreshToken(ctx *gin.Context) {
	refreshToken, err := ctx.Cookie("refreshToken")
	if err != nil {
		ctx.JSON(401, utils.Response[string]{Success: false, Data: "Refresh token not found"})
		return
	}
	newAccessToken, err := ac.service.RefreshTokens(ctx, refreshToken)
	ctx.SetCookie(
		"accessToken",           // name
		newAccessToken,            // value
		15*60,                   // maxAge (seconds)
		"/",                     // path
		"",                      // domain (empty = current domain)
		false,                   // secure (set true in production)
		true,                    // httpOnly
	)
	if err != nil {
		ctx.JSON(401, utils.Response[string]{Success: false, Data: "Invalid refresh token"})
		return
	}
	
	ctx.JSON(200, utils.Response[string]{Success: true, Data: "Access token refreshed successfully"})
}


func (ac *AuthController) LoggedInUserController(ctx *gin.Context) {
	email, exists := ctx.Get("email")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, utils.Response[string]{Success: false, Data: "User not logged in"})
		return
	}

	user, err := ac.service.GetLoggedInUser(ctx, email.(string))
	var userResponse models.UserResponse
	userResponse.Id = user.Id
	userResponse.Username = user.Username
	userResponse.ProfilePic = user.ProfilePic
	userResponse.Email = user.Email
	userResponse.Name = user.Name
	userResponse.Bio = user.Bio
	userResponse.IsAdmin = user.IsAdmin
	userResponse.Saved = user.Saved
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.Response[string]{Success: false, Data: err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, utils.Response[models.UserResponse]{Success: true, Data: userResponse})
}

func (ac *AuthController) Logout(ctx *gin.Context) {
	// Clear the refresh token cookie
	ctx.SetCookie(
        "refreshToken",
        "",
        -1, 
        "/",
        "",
        false,                 
        true,                 
    )
	ctx.SetCookie(
        "accessToken",
        "",
        -1, 
        "/",
        "",
        false,                 
        true,                 
    )
	
	ctx.JSON(http.StatusOK, utils.Response[string]{Success: true, Data: "Logged out successfully"})
}

func (ac *AuthController) GetAllBlogsOfUser(ctx *gin.Context) {
	userId, exists := ctx.Get("userId")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, utils.Response[string]{Success: false, Data: "User not logged in"})
		return
	}
	blogs, err := ac.service.GetAllBlogsByUserId(ctx, userId.(string))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.Response[string]{Success: false, Data: err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, utils.Response[[]models.Blog]{Success: true, Data: blogs})
}