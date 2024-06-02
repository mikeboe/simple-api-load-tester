package main

import (
	"github.com/gorilla/mux"
)

func NewRouter() *mux.Router {
	router := mux.NewRouter().StrictSlash(true)
	router.HandleFunc("/loadTest", loadTestHandler).Methods("GET")
	// router.HandleFunc("/status", statusHandler).Methods("GET")
	return router
}
