package loadTest

import (
	"fmt"
	"io/ioutil"
	"log"
	"os"

	"gopkg.in/yaml.v2"
)

type Endpoint struct {
	URL    string                 `yaml:"url"`
	Method string                 `yaml:"method"`
	Data   map[string]interface{} `yaml:"data,omitempty"`
}

type Config struct {
	RequestsPerSecond          int               `yaml:"requestsPerSecond"`
	DurationInSeconds          int               `yaml:"durationInSeconds"`
	TimescaleDBConn            string            `yaml:"timescaleDBConn"`
	Headers                    map[string]string `yaml:"headers"`
	UseStatisticalDistribution bool              `yaml:"useStatisticalDistribution"`
	BaseUrl                    string            `yaml:"baseURL"`
	TestID                     string            `yaml:"testID"`
}

type ConfigFile struct {
	Config    Config     `yaml:"config"`
	Endpoints []Endpoint `yaml:"endpoints"`
}

func LoadConfigFromYAML(filename string) (Config, []Endpoint) {
	file, err := os.Open(filename)
	if err != nil {
		log.Fatalf("Error opening YAML file: %v", err)
	}
	defer file.Close()

	byteValue, err := ioutil.ReadAll(file)
	if err != nil {
		log.Fatalf("Error reading YAML file: %v", err)
	}

	var configFile ConfigFile
	if err := yaml.Unmarshal(byteValue, &configFile); err != nil {
		log.Fatalf("Error parsing YAML file: %v", err)
	}

	config := configFile.Config
	endpoints := configFile.Endpoints

	// Debugging: print the loaded config
	fmt.Printf("Loaded config: %+v\n", config)
	fmt.Printf("Loaded endpoints: %+v\n", endpoints)

	// Validate configuration
	if config.RequestsPerSecond <= 0 {
		log.Fatalf("Invalid configuration: requestsPerSecond must be greater than zero")
	}
	if config.DurationInSeconds <= 0 {
		log.Fatalf("Invalid configuration: durationInSeconds must be greater than zero")
	}
	if config.TimescaleDBConn == "" {
		log.Fatalf("Invalid configuration: timescaleDBConn must be specified")
	}
	if len(endpoints) == 0 {
		log.Fatalf("Invalid configuration: At least one endpoint must be specified")
	}

	return config, endpoints
}
