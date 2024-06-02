CREATE TABLE IF NOT EXISTS api_logs (
    test_id UUID NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    method TEXT,
    url TEXT,
    response_time_ms DOUBLE PRECISION,
    status_code INT,
    response_message TEXT
);

SELECT create_hypertable('api_logs', 'timestamp');