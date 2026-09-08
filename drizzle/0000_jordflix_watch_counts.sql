CREATE TABLE IF NOT EXISTS jordflix_watch_counts (
  media_type text NOT NULL CHECK (media_type IN ('movie', 'tv')),
  tmdb_id integer NOT NULL,
  watch_date date NOT NULL DEFAULT CURRENT_DATE,
  watch_count integer NOT NULL DEFAULT 1 CHECK (watch_count > 0),
  media jsonb NOT NULL,
  PRIMARY KEY (media_type, tmdb_id, watch_date)
);

CREATE INDEX IF NOT EXISTS jordflix_watch_counts_date_idx
  ON jordflix_watch_counts (watch_date DESC);
