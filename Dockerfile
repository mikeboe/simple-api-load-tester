# Build stage
FROM golang:1.22 AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY /api ./
COPY /loadTest ./loadTest

RUN GOOS=linux GOARCH=amd64 go build -o main .

# Run stage
FROM debian:buster-slim

WORKDIR /root

# Copy the built binary from the builder stage
COPY --from=builder /app/main .

# Ensure the binary has execution permissions
RUN chmod +x main

EXPOSE 8000

# Command to run the binary
CMD ["./main"]
