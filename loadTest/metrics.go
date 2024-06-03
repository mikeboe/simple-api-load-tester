package loadTest

import (
	"context"
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/gorilla/websocket"
	"github.com/jackc/pgx/v4/pgxpool"
)

type EndpointStats struct {
	Count     int
	TotalTime time.Duration
}

type Metrics struct {
	mu                sync.Mutex
	TotalRequests     int
	SuccessfulReqs    int
	FailedReqs        int
	TotalTime         time.Duration
	ResponseTimes     []time.Duration
	EndpointStats     map[string]*EndpointStats
	RequestsPerSecond map[int]int
	db                *pgxpool.Pool
	TestID            string
	StartTime         time.Time
	// conn              *websocket.Conn
}

func NewMetrics(db *pgxpool.Pool, testID string) *Metrics {
	return &Metrics{
		db:                db,
		TestID:            testID,
		EndpointStats:     make(map[string]*EndpointStats),
		RequestsPerSecond: make(map[int]int),
		StartTime:         time.Now(),
	}
}

/* func NewConn(conn *websocket.Conn) *Metrics {
	return &Metrics{
		conn: conn,
	}
} */

func SendMetrics(testID string, timestamp time.Time, method, url string, responseTime int64, statusCode int, responseMessage string, conn *websocket.Conn) {

	message := map[string]interface{}{
		"test_id":          testID,
		"timestamp":        timestamp,
		"method":           method,
		"url":              url,
		"response_time_ms": responseTime,
		"status_code":      statusCode,
		// "response_message": responseMessage,
	}

	// log.Println(message)
	if conn != nil {
		fmt.Println("Sending metrics to client")
		err := conn.WriteJSON(message)
		if err != nil {
			log.Printf("Error writing to WebSocket: %v\n", err)
		}
	}
}

func SendReport(testID string, conn *websocket.Conn, totalRequests, successfulReqs, failedReqs int, avgResponseTime, minResponseTime, maxResponseTime time.Duration, actualRequestsPerSecond float64, requestsPerSecond map[int]int, endpointStats map[string]*EndpointStats) {
	message := map[string]interface{}{
		"test_id": testID,
		"status":  "Load test completed",
		"metrics": map[string]interface{}{
			"total_requests":          totalRequests,
			"successful_requests":     successfulReqs,
			"failed_requests":         failedReqs,
			"success_rate":            float64(successfulReqs) / float64(totalRequests) * 100,
			"failure_rate":            float64(failedReqs) / float64(totalRequests) * 100,
			"average_response_time":   avgResponseTime,
			"min_response_time":       minResponseTime,
			"max_response_time":       maxResponseTime,
			"actual_requests_per_sec": actualRequestsPerSecond,
			"requests_per_second":     requestsPerSecond,
			"endpoint_stats":          endpointStats,
		},
	}

	if conn != nil {
		err := conn.WriteJSON(message)
		if err != nil {
			log.Printf("Error writing to WebSocket: %v\n", err)
		}
	}
}

func (m *Metrics) LogRequest(startTime time.Time, duration time.Duration, success bool, endpoint Endpoint, statusCode int, responseMessage string, conn *websocket.Conn) {
	m.mu.Lock()
	defer m.mu.Unlock()

	elapsedSeconds := int(time.Since(m.StartTime).Seconds())
	m.RequestsPerSecond[elapsedSeconds]++

	m.TotalRequests++
	m.ResponseTimes = append(m.ResponseTimes, duration)
	m.TotalTime += duration
	if success {
		m.SuccessfulReqs++
	} else {
		m.FailedReqs++
	}

	// Track stats per endpoint
	key := fmt.Sprintf("%s %s", endpoint.Method, endpoint.URL)
	if _, exists := m.EndpointStats[key]; !exists {
		m.EndpointStats[key] = &EndpointStats{}
	}
	m.EndpointStats[key].Count++
	m.EndpointStats[key].TotalTime += duration

	time := time.Now()

	// Write to TimescaleDB
	_, err := m.db.Exec(context.Background(), `
		INSERT INTO api_logs (test_id, timestamp, method, url, response_time_ms, status_code, response_message)
		VALUES ($1, $2, $3, $4, $5, $6, $7)`,
		m.TestID, time, endpoint.Method, endpoint.URL, duration.Milliseconds(), statusCode, responseMessage,
	)
	if err != nil {
		log.Printf("Error writing to TimescaleDB: %v", err)
	}

	// Send metrics to the client
	if conn != nil {

		SendMetrics(m.TestID, time, endpoint.Method, endpoint.URL, duration.Milliseconds(), statusCode, responseMessage, conn)
	}
}

func min(times []time.Duration) time.Duration {
	min := times[0]
	for _, t := range times {
		if t < min {
			min = t
		}
	}
	return min
}

func max(times []time.Duration) time.Duration {
	max := times[0]
	for _, t := range times {
		if t > max {
			max = t
		}
	}
	return max
}

// PrintSummary prints a summary of the load test metrics.
// It takes the actual duration of the test and a WebSocket connection as parameters.
// The function calculates various metrics such as average response time, success rate, failure rate,
// minimum and maximum response times, and actual requests per second.
// It then prints the metrics to the console.
// Additionally, if a WebSocket connection is provided, it sends the metrics as a report to the client.
func (m *Metrics) PrintSummary(actualDuration time.Duration, conn *websocket.Conn) {
	m.mu.Lock()
	defer m.mu.Unlock()
	avgResponseTime := m.TotalTime / time.Duration(m.TotalRequests)
	actualRequestsPerSecond := float64(m.TotalRequests) / actualDuration.Seconds()
	fmt.Printf("Test ID: %s\n", m.TestID)
	fmt.Printf("--------------------\n")
	fmt.Printf("Total Requests: %d\n", m.TotalRequests)
	fmt.Printf("--------------------\n")
	fmt.Printf("Successful Requests: %d\n", m.SuccessfulReqs)
	fmt.Printf("Success Rate: %.2f%%\n", float64(m.SuccessfulReqs)/float64(m.TotalRequests)*100)
	fmt.Printf("--------------------\n")
	fmt.Printf("Failed Requests: %d\n", m.FailedReqs)
	fmt.Printf("Failure Rate: %.2f%%\n", float64(m.FailedReqs)/float64(m.TotalRequests)*100)
	fmt.Printf("--------------------\n")
	fmt.Printf("Average Response Time: %s\n", avgResponseTime)
	fmt.Printf("Min Response Time: %s\n", min(m.ResponseTimes))
	fmt.Printf("Max Response Time: %s\n", max(m.ResponseTimes))
	fmt.Printf("--------------------\n")
	fmt.Printf("Actual Requests Per Second: %.2f\n", actualRequestsPerSecond)
	fmt.Printf("--------------------\n")
	fmt.Println("Endpoint Statistics:")

	// Print requests per second and endpoint stats
	fmt.Println("Requests Per Second:")
	for second, count := range m.RequestsPerSecond {
		fmt.Printf("Second %d: %d requests\n", second, count)
	}

	fmt.Println("Endpoint Statistics:")
	for key, stats := range m.EndpointStats {
		avgTime := stats.TotalTime / time.Duration(stats.Count)
		fmt.Printf("Endpoint: %s - Count: %d - Average Response Time: %s\n", key, stats.Count, avgTime)
	}

	// Send report to the client
	if conn != nil {
		SendReport(m.TestID, conn, m.TotalRequests, m.SuccessfulReqs, m.FailedReqs, avgResponseTime, min(m.ResponseTimes), max(m.ResponseTimes), actualRequestsPerSecond, m.RequestsPerSecond, m.EndpointStats)
	}

}
