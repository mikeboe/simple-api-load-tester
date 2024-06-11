import { serial, text, timestamp, pgTable, integer, doublePrecision, boolean } from "drizzle-orm/pg-core";

export const api_logs = pgTable('api_logs', {
  test_id: text("test_id").primaryKey().notNull(),
  timestamp: timestamp("timestamp", { withTimezone: true, mode: 'string' }).defaultNow(),
  method: text("method"),
  url: text("url"),
  response_time_ms: doublePrecision("response_time_ms"),
  status_code: integer("status_code"),
  response_message: text("response_message"),
});

export const tests = pgTable('tests', {
  id: text("id").primaryKey().notNull(),
  test_name: text("test_name"),
  base_url: text("base_url"),
  duration: integer("duration"),
  rps: integer("rps"),
  use_statistical_distribution: boolean("use_statistical_distribution"),
  headers: text("headers"),
  endpoints: text("text"),
  created_at: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});
