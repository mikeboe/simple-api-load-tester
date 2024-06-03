package loadTest

import (
	"context"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/go-co-op/gocron"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/joho/godotenv"
)

func StartLoadTest(config Config, endpoints []Endpoint, conn *websocket.Conn) {
	client := &http.Client{}
	var wg sync.WaitGroup

	// Initialize TimescaleDB client
	dbString := os.Getenv("DB_STRING")
	if dbString == "" {
		log.Fatalf("DB_STRING environment variable not set.")
	}
	dbpool, err := pgxpool.Connect(context.Background(), dbString)
	if err != nil {
		log.Fatalf("Unable to connect to TimescaleDB: %v", err)
	}
	defer dbpool.Close()

	// Generate a unique test ID for this run
	testID := uuid.New()

	metrics := NewMetrics(dbpool, testID)

	ticker := time.NewTicker(time.Second / time.Duration(config.RequestsPerSecond))
	defer ticker.Stop()

	totalRequests := config.RequestsPerSecond * config.DurationInSeconds

	// Send requests
	fmt.Printf("Starting load test with %d requests per second for %d seconds...\n", config.RequestsPerSecond, config.DurationInSeconds)

	for i := 0; i < totalRequests; i++ {
		wg.Add(1)
		var endpoint Endpoint
		if config.UseStatisticalDistribution {
			endpoint = GetStatisticalEndpoint(endpoints)
		} else {
			endpoint = GetRandomEndpoint(endpoints)
		}
		go SendRequest(client, config, endpoint, metrics, &wg, conn)
		// logMessage(conn, fmt.Sprintf("Sending request %d to %s", i+1, endpoint.URL))
		<-ticker.C
	}

	wg.Wait()
	actualDuration := time.Since(metrics.StartTime)
	fmt.Println("Load test completed.")
	metrics.PrintSummary(actualDuration)
}

func ScheduleLoadTest(config Config, endpoints []Endpoint, conn *websocket.Conn) {
	scheduler := gocron.NewScheduler(time.UTC)

	// Get the cron schedule from the environment variable
	cronSchedule := os.Getenv("SCHEDULE")
	if cronSchedule == "" {
		fmt.Println("SCHEDULE environment variable not set, running now...\n")
		StartLoadTest(config, endpoints, conn)
	}

	// Schedule the load test based on the environment variable
	_, err := scheduler.Cron(cronSchedule).Do(func() {
		fmt.Println("Starting scheduled load test...")
		StartLoadTest(config, endpoints, conn)
	})
	if err != nil {
		log.Fatalf("Error scheduling load test: %v", err)
	}

	// Start the scheduler
	scheduler.StartBlocking()
}

func main() {
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	rand.Seed(time.Now().UnixNano()) // Seed the random number generator
	config, endpoints := LoadConfigFromYAML("config.yaml")
	ScheduleLoadTest(config, endpoints, nil)
}
