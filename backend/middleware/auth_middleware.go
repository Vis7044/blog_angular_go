package middleware

import (
	"github.com/blog_go/utils"
	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func (ctx *gin.Context) {
		tokenString := ctx.GetHeader("Authorization")
		if tokenString == "" {
			ctx.AbortWithStatusJSON(401, utils.Response[string]{Success: false, Data: "Authorization header is missing"})
			return
		}
		if len(tokenString) < 7 || tokenString[:7] != "Bearer " {
			ctx.AbortWithStatusJSON(401, utils.Response[string]{Success: false, Data: "Invalid token format"})
			return
		}
		tokenString = tokenString[7:]
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