# Build stage
FROM golang:1.22 AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN GOOS=linux GOARCH=amd64 go build -o api .

# Run stage
FROM debian:buster-slim

WORKDIR /root

COPY --from=builder /app/api .
COPY --from=builder /app/config.yaml .

CMD ["./api"]
