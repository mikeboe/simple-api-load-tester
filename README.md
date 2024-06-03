# Simple API Load Testing 

This project is a Go-based API load testing tool. It allows you to send concurrent requests to specified endpoints. You can log the requests to timescale DB, use the UI or just a plain docker container.

## Features

- Concurrent API requests
- Customizable request rate and duration
- Response time logging to InfluxDB
- WebSocket support for real-time updates

## install

```bash
git clone https://github.com/mikeboe/simple-api-load-tester.git
docker compose up -d
```



