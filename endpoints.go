package main

import (
	"math/rand"

	"gonum.org/v1/gonum/stat/distuv"
)

func GetRandomEndpoint(endpoints []Endpoint) Endpoint {
	return endpoints[rand.Intn(len(endpoints))]
}

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
