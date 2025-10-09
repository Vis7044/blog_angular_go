package utils

import (
	"errors"
	"github.com/blog_go/config"
	"github.com/golang-jwt/jwt"
)

func ParseToken(tokenString string) (jwt.MapClaims, error) {
	secretKey := []byte(config.Cfg.Jwt_secret) 

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return secretKey, nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return claims, nil
	}

	return nil, errors.New("invalid token")
}
