package main

import (
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

// main is the entry point of the application.
// It loads the environment variables, initializes the router,
// and starts the server on port 8000.
func main() {
	readErr := godotenv.Load()
	if readErr != nil {
		log.Println("Error loading .env file")
	}
	dbString := os.Getenv("DB_STRING")
	if dbString == "" {
		log.Fatalf("DB_STRING environment variable not set.")
	}
	router := NewRouter()
	log.Println("Server is starting on port 8000...")
	log.Fatal(http.ListenAndServe(":8000", router))
}
