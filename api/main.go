package main

import (
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	readErr := godotenv.Load()
	if readErr != nil {
		log.Fatal("Error loading .env file")
	}
	dbString := os.Getenv("DB_STRING")
	if dbString == "" {
		log.Fatalf("DB_STRING environment variable not set.")
	}
	router := NewRouter()
	log.Println("Server is starting on port 8000...")
	log.Fatal(http.ListenAndServe(":8000", router))
}
