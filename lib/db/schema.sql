-- SQLite Database Schema for Chat Analytics

-- Chat Sessions Table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id TEXT PRIMARY KEY,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_activity DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES chat_sessions(id)
);

-- Product Searches Table (tracks what users are looking for)
CREATE TABLE IF NOT EXISTS product_searches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  message_id INTEGER NOT NULL,
  search_query TEXT NOT NULL,
  products_found INTEGER DEFAULT 0,
  top_products TEXT, -- JSON array of product IDs found
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES chat_sessions(id),
  FOREIGN KEY (message_id) REFERENCES chat_messages(id)
);

-- Missing Products Table (tracks requests for unavailable products)
CREATE TABLE IF NOT EXISTS missing_products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  message_id INTEGER NOT NULL,
  search_query TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES chat_sessions(id),
  FOREIGN KEY (message_id) REFERENCES chat_messages(id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_product_searches_session ON product_searches(session_id);
CREATE INDEX IF NOT EXISTS idx_product_searches_created ON product_searches(created_at);
CREATE INDEX IF NOT EXISTS idx_missing_products_created ON missing_products(created_at);

