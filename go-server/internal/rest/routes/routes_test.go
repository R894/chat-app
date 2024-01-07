package routes_test

import (
	"bytes"
	"encoding/json"
	"go-chatserver/internal/repository"
	"go-chatserver/internal/rest/routes"
	"go-chatserver/internal/testdata"
	"log"
	"net/http"
	"net/http/httptest"
	"path/filepath"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/stretchr/testify/assert"
)

type testServer struct {
	router  *gin.Engine
	repo    *repository.Repository
	cleanup func()
}

func setupTestServer() testServer {
	projectRoot, err := filepath.Abs("../../..")
	if err != nil {
		log.Fatal(err)
	}
	router := gin.Default()

	err = godotenv.Load(filepath.Join(projectRoot, ".env"))
	if err != nil {
		log.Fatal(err)
	}

	repo, cleanup := testdata.SetupTestDatabase()
	if err != nil {
		log.Fatal(err)
	}
	routes.SetupRoutes(router, repo)
	// add auth middleware
	srv := testServer{router: router, repo: repo, cleanup: cleanup}

	return srv
}

func TestCreateChatUnauthorized(t *testing.T) {
	srv := setupTestServer()

	requestBody := map[string]interface{}{
		"firstId":  "12312312312",
		"secondId": "32132131231",
	}

	jsonBody, err := json.Marshal(requestBody)
	if err != nil {
		log.Fatal("Error marshaling JSON:", err)
	}

	req, err := http.NewRequest("POST", "/api/chats/", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	assert.NoError(t, err)

	w := httptest.NewRecorder()
	srv.router.ServeHTTP(w, req)
	assert.Equal(t, http.StatusUnauthorized, w.Code)

	srv.cleanup()
}

func TestLoginValid(t *testing.T) {
	srv := setupTestServer()
	requestBody := map[string]interface{}{
		"email":    "johndoe@gmail.com",
		"password": "johndoe",
	}

	jsonBody, err := json.Marshal(requestBody)
	if err != nil {
		log.Fatal("Error marshaling JSON:", err)
	}

	req, err := http.NewRequest("POST", "/api/users/login", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	assert.NoError(t, err)

	w := httptest.NewRecorder()
	srv.router.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)

	srv.cleanup()
}
