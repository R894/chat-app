package auth

import (
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt"
)

type UserClaims struct {
	Id string `json:"_id"`
	jwt.StandardClaims
}

func GenerateJwtKey(id string) (string, error) {
	key := []byte(os.Getenv("JWT_SECRET"))
	claims := UserClaims{
		Id: id,
		StandardClaims: jwt.StandardClaims{
			IssuedAt:  time.Now().Unix(),
			ExpiresAt: time.Now().Add(time.Minute * 15).Unix(),
		},
	}

	t := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	s, err := t.SignedString(key)
	if err != nil {
		return "", err
	}

	return s, nil
}

func ValidateJwtKey(tokenString string) (*UserClaims, error) {
	key := []byte(os.Getenv("JWT_SECRET"))

	// Parse the token
	token, err := jwt.ParseWithClaims(tokenString, &UserClaims{}, func(token *jwt.Token) (interface{}, error) {
		return key, nil
	})

	if err != nil {
		return nil, fmt.Errorf("error parsing token: %v", err)
	}

	// Check if the token is valid
	if !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	// Extract claims
	claims, ok := token.Claims.(*UserClaims)
	if !ok {
		return nil, fmt.Errorf("error extracting claims")
	}

	return claims, nil
}
