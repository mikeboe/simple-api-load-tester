package loadTest

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

func fullUrl(baseUrl string, endpoint string) string {
	return baseUrl + endpoint
}

// SendRequest sends an HTTP request to the specified endpoint using the provided client.
// It logs the request metrics and response details to the specified metrics object.
// The function runs asynchronously using the provided wait group.
// If a websocket connection is provided, it will be used to log the request details.
//
// Parameters:
//   - client: The HTTP client to use for sending the request.
//   - config: The configuration object containing the base URL and headers.
//   - endpoint: The endpoint details including the URL, method, and data.
//   - metrics: The metrics object used for logging request metrics.
//   - wg: The wait group used for synchronizing the asynchronous execution.
//   - conn: The websocket connection used for logging request details.
//
// Note: The function assumes that the `Metrics` and `Endpoint` types are defined.
// It also assumes that the `fullUrl` function is defined to construct the full URL.
func SendRequest(client *http.Client, config Config, endpoint Endpoint, metrics *Metrics, wg *sync.WaitGroup, conn *websocket.Conn) {
	defer wg.Done()
	start := time.Now()

	var req *http.Request
	var err error
	if endpoint.Data != nil {
		data, err := json.Marshal(endpoint.Data)
		if err != nil {
			fmt.Printf("Error marshaling data: %s - Endpoint: %s\n", err.Error(), endpoint.URL)
			metrics.LogRequest(start, 0, false, endpoint, 0, err.Error(), conn)
			return
		}
		req, err = http.NewRequest(endpoint.Method, fullUrl(config.BaseUrl, endpoint.URL), bytes.NewBuffer(data))
		req.Header.Set("Content-Type", "application/json")
	} else {
		req, err = http.NewRequest(endpoint.Method, fullUrl(config.BaseUrl, endpoint.URL), nil)
	}

	if err != nil {
		fmt.Printf("Error creating request: %s - Endpoint: %s\n", err.Error(), endpoint.URL)
		metrics.LogRequest(start, 0, false, endpoint, 0, err.Error(), conn)
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
	metrics.LogRequest(start, duration, success, endpoint, statusCode, responseMessage, conn)

}
