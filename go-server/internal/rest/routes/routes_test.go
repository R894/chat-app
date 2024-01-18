package routes_test

import (
	"bytes"
	"encoding/json"
	"fmt"
	"go-chatserver/internal/repository"
	"go-chatserver/internal/rest/routes"
	"go-chatserver/internal/testdata"
	"log"
	"net/http"
	"net/http/httptest"
	"os"
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

// performRequest performs an HTTP request to the specified server using the given method, path, and request body
func performRequest(t *testing.T, srv testServer, method, path, bearerToken string, body interface{}) (*httptest.ResponseRecorder, map[string]interface{}) {
	jsonBody, err := json.Marshal(body)
	if err != nil {
		log.Fatal("Error marshaling JSON:", err)
	}

	req, err := http.NewRequest(method, path, bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+bearerToken)
	assert.NoError(t, err)

	w := httptest.NewRecorder()
	srv.router.ServeHTTP(w, req)

	var responseBody map[string]interface{}
	err = json.NewDecoder(w.Body).Decode(&responseBody)
	if err != nil {
		log.Fatal("Error decoding response body:", err)
	}

	return w, responseBody
}

// setupTestServer initializes and returns a testServer for unit tests
// the servers router, repository and cleanup function are returned
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
	srv := testServer{router: router, repo: repo, cleanup: cleanup}

	return srv
}

// TODO: Make these tests faster
var srv testServer

func TestMain(m *testing.M) {
	srv = setupTestServer()
	exitcode := m.Run()
	srv.cleanup()

	os.Exit(exitcode)
}

func TestCreateChatUnauthorized(t *testing.T) {
	requestBody := map[string]interface{}{
		"firstId":  "12312312312",
		"secondId": "32132131231",
	}

	w, _ := performRequest(t, srv, "POST", "/api/chats/", "", requestBody)
	assert.Equal(t, http.StatusUnauthorized, w.Code)
}

func TestCreateChatAuthorized(t *testing.T) {
	requestBody := map[string]interface{}{
		"email":    "johndoe@gmail.com",
		"password": "johndoe",
	}

	w, body := performRequest(t, srv, "POST", "/api/users/login", "", requestBody)

	token, ok := body["token"].(string)
	if !ok {
		t.Fatalf("Token not found in login response")
	}

	requestBody = map[string]interface{}{
		"firstId":  "12312312312",
		"secondId": "32132131231",
	}

	w, _ = performRequest(t, srv, "POST", "/api/chats/", token, requestBody)
	assert.Equal(t, http.StatusOK, w.Code)
}

func TestLoginValid(t *testing.T) {
	requestBody := map[string]interface{}{
		"email":    "johndoe@gmail.com",
		"password": "johndoe",
	}
	w, _ := performRequest(t, srv, "POST", "/api/users/login", "", requestBody)
	assert.Equal(t, http.StatusOK, w.Code)
}

func TestLoginInvalid(t *testing.T) {
	requestBody := map[string]interface{}{
		"email":    "johndoe@gmail.com",
		"password": "notjohn",
	}
	w, _ := performRequest(t, srv, "POST", "/api/users/login", "", requestBody)
	assert.Equal(t, http.StatusUnauthorized, w.Code)
}

func TestMessageInvalid(t *testing.T) {
	requestBody := map[string]interface{}{
		"chatId": "123",
		"userId": "555",
	}
	w, _ := performRequest(t, srv, "POST", "/api/messages/", "", requestBody)
	assert.Equal(t, http.StatusUnauthorized, w.Code)
}

func TestMessagevalid(t *testing.T) {
	requestBody := map[string]interface{}{
		"email":    "johndoe@gmail.com",
		"password": "johndoe",
	}

	w, body := performRequest(t, srv, "POST", "/api/users/login", "", requestBody)

	token, ok := body["token"].(string)
	if !ok {
		t.Fatalf("Token not found in login response")
	}

	userId, ok := body["user"].(map[string]interface{})["_id"].(string)
	if !ok {
		t.Fatalf("Userid not found in login response")
	}

	requestBody = map[string]interface{}{
		"firstId":  "12312312312",
		"secondId": "32132131231",
	}

	w, body = performRequest(t, srv, "POST", "/api/chats/", token, requestBody)
	assert.Equal(t, http.StatusOK, w.Code)

	chatId, ok := body["_id"].(string)
	if !ok {
		t.Fatalf("Chat ID not found in response")
	}

	fmt.Println(chatId)

	requestBody = map[string]interface{}{
		"chatId":   chatId,
		"senderId": userId,
		"text":     "hello",
	}
	w, _ = performRequest(t, srv, "POST", "/api/messages/", token, requestBody)
	assert.Equal(t, http.StatusOK, w.Code)
}
