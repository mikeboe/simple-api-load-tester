package loadTest

import (
	"math/rand"

	"gonum.org/v1/gonum/stat/distuv"
)

func GetRandomEndpoint(endpoints []Endpoint) Endpoint {
	return endpoints[rand.Intn(len(endpoints))]
}

// GetStatisticalEndpoint returns a random endpoint from the given list of endpoints,
// with a bias towards the middle of the list.
// The spread of the bias is controlled by adjusting the sigma value.
func GetStatisticalEndpoint(endpoints []Endpoint) Endpoint {
	norm := distuv.Normal{
		Mu:    float64(len(endpoints)-1) / 2,
		Sigma: float64(len(endpoints)) / 6, // Adjust sigma to control spread
	}
	index := int(norm.Rand())
	if index < 0 {
		index = 0
	} else if index >= len(endpoints) {
		index = len(endpoints) - 1
	}
	return endpoints[index]
}
