package config

import (
	"log"
	"os"
	"github.com/joho/godotenv"
)

type AppConfig struct {
	MongoURI string
	Jwt_secret string
	CloudinaryCloudName string
	CloudinaryApiKey string
	CloudinaryApiSecret string
	RefreshToken_secret string
	BrevoApiKey string
	BrevoEmail string
}

var loaded = false
var Cfg *AppConfig

func LoadConfig() {
	if loaded {
		return
	}
	err := godotenv.Load()
	if err != nil {
    log.Println(".env file not found — using environment variables from Docker or system")
}

	Cfg = &AppConfig{
		MongoURI: os.Getenv("MONGO_URI"),
		Jwt_secret: os.Getenv("JWT_SECRET"),
		CloudinaryCloudName: os.Getenv("CLOUDINARY_CLOUD_NAME"),
		CloudinaryApiKey: os.Getenv("CLOUDINARY_API_KEY"),
		CloudinaryApiSecret: os.Getenv("CLOUDINARY_API_SECRET"),
		RefreshToken_secret: os.Getenv("REFRESH_TOKEN_SECRET"),
		BrevoApiKey: os.Getenv("BREVO_API_KEY"),
		BrevoEmail: os.Getenv("BREVO_EMAIL"),
	}


	if Cfg.MongoURI == "" {
		log.Fatal("MONGO_URI is not set")
	}
	if Cfg.Jwt_secret == "" || Cfg.RefreshToken_secret == "" {
		log.Fatal("JWT_SECRET or REFRESH_TOKEN_SECRET is not set")
	}
	if Cfg.CloudinaryCloudName == "" || Cfg.CloudinaryApiKey == "" || Cfg.CloudinaryApiSecret == "" {
		log.Fatal("Cloudinary configuration is not set properly")
	}
	if Cfg.BrevoApiKey == "" {
		log.Fatal("BREVO_API_KEY is not set")
	}
	if Cfg.BrevoEmail == "" {
		log.Fatal("BREVO_EMAIL is not set")
	}
	loaded = true
}
