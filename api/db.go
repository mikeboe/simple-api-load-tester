package main

import (
	"database/sql"
	"log"
	"os"

	_ "github.com/lib/pq"
)

var db *sql.DB

// initDB initializes the database connection.
// It reads the database connection string from the environment variable "DB_STRING",
// opens a connection to the PostgreSQL database, and pings the database to ensure connectivity.
// If any error occurs during the process, it logs a fatal error and exits the program.
func initDB() {

	connStr := os.Getenv("DB_STRING")
	if connStr == "" {
		log.Fatalf("DB_STRING environment variable not set.")
	}

	var err error
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalf("Error connecting to the database: %v", err)
	}

	err = db.Ping()
	if err != nil {
		log.Fatalf("Error pinging the database: %v", err)
	}
}
