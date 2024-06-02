package loadTest

import (
	"context"
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/google/uuid"
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
	TestID            uuid.UUID
	StartTime         time.Time
}

func NewMetrics(db *pgxpool.Pool, testID uuid.UUID) *Metrics {
	return &Metrics{
		db:                db,
		TestID:            testID,
		EndpointStats:     make(map[string]*EndpointStats),
		RequestsPerSecond: make(map[int]int),
		StartTime:         time.Now(),
	}
}

func (m *Metrics) LogRequest(startTime time.Time, duration time.Duration, success bool, endpoint Endpoint, statusCode int, responseMessage string) {
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

	// Write to TimescaleDB
	_, err := m.db.Exec(context.Background(), `
		INSERT INTO api_logs (test_id, timestamp, method, url, response_time_ms, status_code, response_message)
		VALUES ($1, $2, $3, $4, $5, $6, $7)`,
		m.TestID, time.Now(), endpoint.Method, endpoint.URL, duration.Milliseconds(), statusCode, responseMessage,
	)
	if err != nil {
		log.Printf("Error writing to TimescaleDB: %v", err)
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

func (m *Metrics) PrintSummary(actualDuration time.Duration) {
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

	// Print requests per second
	fmt.Println("Requests Per Second:")
	for second, count := range m.RequestsPerSecond {
		fmt.Printf("Second %d: %d requests\n", second, count)
	}

	fmt.Println("Endpoint Statistics:")
	for key, stats := range m.EndpointStats {
		avgTime := stats.TotalTime / time.Duration(stats.Count)
		fmt.Printf("Endpoint: %s - Count: %d - Average Response Time: %s\n", key, stats.Count, avgTime)
	}
}
