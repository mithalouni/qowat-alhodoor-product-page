CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  stripe_session_id TEXT NOT NULL UNIQUE,
  stripe_payment_intent TEXT,
  customer_email TEXT NOT NULL,
  amount_total INTEGER,
  currency TEXT,
  status TEXT NOT NULL,
  download_token TEXT UNIQUE,
  download_expires_at TEXT,
  download_count INTEGER NOT NULL DEFAULT 0,
  last_downloaded_at TEXT,
  email_sent_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_download_token ON orders(download_token);

CREATE TABLE IF NOT EXISTS stripe_events (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  payload TEXT NOT NULL,
  processed_at TEXT,
  processing_error TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
