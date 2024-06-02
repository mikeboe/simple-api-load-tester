package main

import (
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		// Allow all connections by returning true
		return true
	},
}

type LoadTestConfig struct {
	Config    Config     `json:"config"`
	Endpoints []Endpoint `json:"endpoints"`
}

func loadTestHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer conn.Close()

	for {
		var msg LoadTestConfig
		err := conn.ReadJSON(&msg)
		if err != nil {
			fmt.Println("Error reading json.", err)
			break
		}

		// Print the received message for debugging
		fmt.Printf("Received message: %+v\n", msg)

		// Trigger the load test
		/* 		go func() {
			// Run the loadTest binary with the provided config and endpoints
			cmd := exec.Command("./loadTest", "--config", "config.yaml") // Adapt this command as needed
			cmd.Stdout = conn.UnderlyingConn()
			cmd.Stderr = conn.UnderlyingConn()
			err := cmd.Run()
			if err != nil {
				fmt.Fprintf(conn.UnderlyingConn(), "Error running load test: %v\n", err)
			}
		}() */

		// run load test from loadTest folder
		ScheduleLoadTest(msg.Config, msg.Endpoints)

		response := map[string]string{"status": "Load test started"}
		conn.WriteJSON(response)
	}
}
