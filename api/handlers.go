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

// loadTestHandler handles the WebSocket connection for load testing.
// It upgrades the HTTP connection to a WebSocket connection, extracts the test ID from the URL,
// and continuously reads JSON messages from the client.
// The received message is printed for debugging purposes, and the test ID is added to the message's configuration.
// Then, it sends a response to the client indicating that the load test is starting.
// Finally, it starts the load test using the received configuration and endpoints, and sends a response to the client
// indicating that the load test has completed.
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
