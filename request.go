package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"sync"
	"time"
)

func SendRequest(client *http.Client, config Config, endpoint Endpoint, metrics *Metrics, wg *sync.WaitGroup) {
	defer wg.Done()
	start := time.Now()

	var req *http.Request
	var err error
	if endpoint.Data != nil {
		data, err := json.Marshal(endpoint.Data)
		if err != nil {
			fmt.Printf("Error marshaling data: %s - Endpoint: %s\n", err.Error(), endpoint.URL)
			metrics.LogRequest(start, 0, false, endpoint, 0, err.Error())
			return
		}
		req, err = http.NewRequest(endpoint.Method, endpoint.URL, bytes.NewBuffer(data))
		req.Header.Set("Content-Type", "application/json")
	} else {
		req, err = http.NewRequest(endpoint.Method, endpoint.URL, nil)
	}

	if err != nil {
		fmt.Printf("Error creating request: %s - Endpoint: %s\n", err.Error(), endpoint.URL)
		metrics.LogRequest(start, 0, false, endpoint, 0, err.Error())
		return
	}

	// Set headers from config
	for key, value := range config.Headers {
		req.Header.Set(key, value)
	}

	resp, err := client.Do(req)
	duration := time.Since(start)

	success := false
	statusCode := 0
	responseMessage := ""
	if err != nil {
		responseMessage = err.Error()
	} else {
		defer resp.Body.Close()
		statusCode = resp.StatusCode
		bodyBytes, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			responseMessage = err.Error()
		} else {
			responseMessage = string(bodyBytes)
		}
		fmt.Printf("Status: %d - Endpoint: %s - Time: %s\n", resp.StatusCode, endpoint.URL, start.Format(time.RFC3339))
		if resp.StatusCode >= 200 && resp.StatusCode < 300 {
			success = true
		}
	}
	metrics.LogRequest(start, duration, success, endpoint, statusCode, responseMessage)
}
