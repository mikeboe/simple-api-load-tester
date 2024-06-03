package main

import (
	"github.com/gorilla/mux"
)

// NewRouter creates a new instance of the router with predefined routes.
func NewRouter() *mux.Router {
	router := mux.NewRouter().StrictSlash(true)
	router.HandleFunc("/{id}", loadTestHandler).Methods("GET")
	return router
}
