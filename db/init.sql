CREATE TABLE IF NOT EXISTS api_logs (
    test_id text NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    method TEXT,
    url TEXT,
    response_time_ms DOUBLE PRECISION,
    status_code INT,
    response_message TEXT
);


SELECT create_hypertable('api_logs', 'timestamp');

CREATE TABLE IF NOT EXISTS tests (
    id text PRIMARY KEY,
    test_name text,
    base_url text,
    duration INT,
    rps INT,
    use_statistical_distribution BOOLEAN,
    headers text,
    endpoints text,
    created_at TIMESTAMPTZ DEFAULT NOW()
);