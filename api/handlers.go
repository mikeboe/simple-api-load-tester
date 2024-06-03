package main

import (
	"fmt"
	"net/http"

	loadTest "simple-api-load-tester/loadTest"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		// Allow all connections by returning true
		return true
	},
}

type LoadTestConfig struct {
	Config    loadTest.Config     `json:"config"`
	Endpoints []loadTest.Endpoint `json:"endpoints"`
}

func loadTestHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer conn.Close()

	// Extract test ID from URL
	vars := mux.Vars(r)
	testID := vars["id"]

	for {
		var msg LoadTestConfig
		err := conn.ReadJSON(&msg)
		if err != nil {
			fmt.Println("Error reading json.", err)
			break
		}

		// Print the received message for debugging
		fmt.Printf("Received message: %+v\n", msg)

		// Add the test ID to the config or use it as needed
		msg.Config.TestID = testID

		conn.WriteJSON(map[string]string{"status": "Starting load test with " + testID})

		// run load test
		loadTest.StartLoadTest(msg.Config, msg.Endpoints, conn)

		response := map[string]string{"status": "Load test completed"}
		conn.WriteJSON(response)
	}
}
