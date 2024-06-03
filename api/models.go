package main

// Config represents the configuration for load testing.
type Config struct {
	ID                         int    `json:"id"`
	RequestsPerSecond          int    `json:"requestsPerSecond"`
	DurationInSeconds          int    `json:"durationInSeconds"`
	UseStatisticalDistribution bool   `json:"useStatisticalDistribution"`
	CronSchedule               string `json:"cronSchedule"`
}

// Endpoint represents an API endpoint.
type Endpoint struct {
	URL    string                 `json:"url"`
	Method string                 `json:"method"`
	Data   map[string]interface{} `json:"data,omitempty"`
}
