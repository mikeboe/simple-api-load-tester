package main

import (
	"context"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v4/pgxpool"
)

func StartLoadTest(config Config, endpoints []Endpoint) {
	client := &http.Client{}
	var wg sync.WaitGroup

	// Initialize TimescaleDB client
	dbpool, err := pgxpool.Connect(context.Background(), config.TimescaleDBConn)
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

	for i := 0; i < totalRequests; i++ {
		wg.Add(1)
		var endpoint Endpoint
		if config.UseStatisticalDistribution {
			endpoint = GetStatisticalEndpoint(endpoints)
		} else {
			endpoint = GetRandomEndpoint(endpoints)
		}
		go SendRequest(client, config, endpoint, metrics, &wg)
		<-ticker.C
	}

	wg.Wait()
	actualDuration := time.Since(metrics.StartTime)
	fmt.Println("Load test completed.")
	metrics.PrintSummary(actualDuration)
}

func main() {
	rand.Seed(time.Now().UnixNano()) // Seed the random number generator
	config, endpoints := LoadConfigFromYAML("config.yaml")
	StartLoadTest(config, endpoints)
}
