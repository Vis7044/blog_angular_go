package middleware

import (
	"github.com/blog_go/utils"
	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func (ctx *gin.Context) {
		tokenString, err := ctx.Cookie("accessToken")
		if err != nil {
			ctx.AbortWithStatusJSON(401, utils.Response[string]{Success: false, Data: "Authorization cookie is missing"})
			return
		}
		if tokenString == "" {
			ctx.AbortWithStatusJSON(401, utils.Response[string]{Success: false, Data: "Authorization cookie is missing"})
			return
		}
		claims, err := utils.ParseToken(tokenString)
		if err != nil {
			ctx.AbortWithStatusJSON(401, utils.Response[string]{Success: false, Data: "Invalid or expired token"})
			return
		}
		ctx.Set("userId", claims["userId"])
		ctx.Set("email", claims["email"])
		ctx.Next()
	}
}