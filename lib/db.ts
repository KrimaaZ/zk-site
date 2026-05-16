import { neon, NeonQueryFunction } from '@neondatabase/serverless'

// Lazily initialise — returns null when DATABASE_URL is not configured so the
// app can fall back to local JSON data without crashing.
let _sql: NeonQueryFunction<false, false> | null = null

export function getDb(): NeonQueryFunction<false, false> | null {
  if (!process.env.DATABASE_URL) return null
  if (!_sql) _sql = neon(process.env.DATABASE_URL)
  return _sql
}

export const SQL_SCHEMA = `
CREATE TABLE IF NOT EXISTS meals (
  id          SERIAL PRIMARY KEY,
  name        TEXT    NOT NULL,
  category    TEXT    NOT NULL CHECK (category IN ('breakfast','main','snack','smoothie','night')),
  protein     INTEGER NOT NULL,
  kcal        INTEGER NOT NULL,
  time_min    INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS exercises (
  id            SERIAL  PRIMARY KEY,
  name          TEXT    NOT NULL,
  muscle        TEXT    NOT NULL,
  equipment     TEXT    NOT NULL,
  training_type TEXT    NOT NULL CHECK (training_type IN ('pull','push','abs','cardio')),
  steps         TEXT[]  NOT NULL,
  footer        TEXT    NOT NULL
);

CREATE TABLE IF NOT EXISTS meal_favorites (
  meal_id INTEGER PRIMARY KEY REFERENCES meals(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS exercise_favorites (
  exercise_id INTEGER PRIMARY KEY REFERENCES exercises(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS schedule_items (
  id          SERIAL  PRIMARY KEY,
  name        TEXT    NOT NULL,
  time_label  TEXT    NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  done        BOOLEAN NOT NULL DEFAULT FALSE
);
`
