import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

let db: Database.Database | null = null;

/**
 * Get or create database connection
 */
export function getDatabase(): Database.Database {
  if (db) return db;

  // Create data directory if it doesn't exist
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Initialize database
  const dbPath = path.join(dataDir, 'analytics.db');
  db = new Database(dbPath);

  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  // Initialize schema
  const schemaPath = path.join(process.cwd(), 'lib', 'db', 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  db.exec(schema);

  console.log('✅ Database initialized at:', dbPath);

  return db;
}

/**
 * Close database connection
 */
export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}

// Types
export interface ChatSession {
  id: string;
  created_at: string;
  last_activity: string;
}

export interface ChatMessage {
  id: number;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface ProductSearch {
  id: number;
  session_id: string;
  message_id: number;
  search_query: string;
  products_found: number;
  top_products: string | null;
  created_at: string;
}

export interface MissingProduct {
  id: number;
  session_id: string;
  message_id: number;
  search_query: string;
  created_at: string;
}

/**
 * Create or get chat session
 */
export function createOrGetSession(sessionId: string): ChatSession {
  const db = getDatabase();

  // Check if session exists
  const existing = db.prepare('SELECT * FROM chat_sessions WHERE id = ?').get(sessionId) as ChatSession | undefined;

  if (existing) {
    // Update last activity
    db.prepare('UPDATE chat_sessions SET last_activity = CURRENT_TIMESTAMP WHERE id = ?').run(sessionId);
    return existing;
  }

  // Create new session
  db.prepare('INSERT INTO chat_sessions (id) VALUES (?)').run(sessionId);
  return db.prepare('SELECT * FROM chat_sessions WHERE id = ?').get(sessionId) as ChatSession;
}

/**
 * Save chat message
 */
export function saveChatMessage(sessionId: string, role: 'user' | 'assistant', content: string): number {
  const db = getDatabase();

  // Ensure session exists
  createOrGetSession(sessionId);

  // Insert message
  const result = db.prepare('INSERT INTO chat_messages (session_id, role, content) VALUES (?, ?, ?)').run(sessionId, role, content);

  return result.lastInsertRowid as number;
}

/**
 * Save product search
 */
export function saveProductSearch(
  sessionId: string,
  messageId: number,
  searchQuery: string,
  productsFound: number,
  topProducts: string[]
): void {
  const db = getDatabase();

  db.prepare(
    'INSERT INTO product_searches (session_id, message_id, search_query, products_found, top_products) VALUES (?, ?, ?, ?, ?)'
  ).run(sessionId, messageId, searchQuery, productsFound, JSON.stringify(topProducts));
}

/**
 * Save missing product request
 */
export function saveMissingProduct(sessionId: string, messageId: number, searchQuery: string): void {
  const db = getDatabase();

  db.prepare('INSERT INTO missing_products (session_id, message_id, search_query) VALUES (?, ?, ?)').run(
    sessionId,
    messageId,
    searchQuery
  );
}

/**
 * Get chat messages for a session
 */
export function getSessionMessages(sessionId: string): ChatMessage[] {
  const db = getDatabase();
  return db.prepare('SELECT * FROM chat_messages WHERE session_id = ? ORDER BY created_at ASC').all(sessionId) as ChatMessage[];
}

/**
 * Get all sessions
 */
export function getAllSessions(limit = 100): ChatSession[] {
  const db = getDatabase();
  return db.prepare('SELECT * FROM chat_sessions ORDER BY last_activity DESC LIMIT ?').all(limit) as ChatSession[];
}

/**
 * Get analytics data
 */
export function getAnalytics(days = 7) {
  const db = getDatabase();

  // Total messages
  const totalMessages = db.prepare("SELECT COUNT(*) as count FROM chat_messages WHERE created_at >= datetime('now', '-' || ? || ' days')").get(days) as { count: number };

  // Total sessions
  const totalSessions = db.prepare("SELECT COUNT(*) as count FROM chat_sessions WHERE created_at >= datetime('now', '-' || ? || ' days')").get(days) as { count: number };

  // Total searches
  const totalSearches = db.prepare("SELECT COUNT(*) as count FROM product_searches WHERE created_at >= datetime('now', '-' || ? || ' days')").get(days) as { count: number };

  // Missing products
  const missingProducts = db.prepare("SELECT COUNT(*) as count FROM missing_products WHERE created_at >= datetime('now', '-' || ? || ' days')").get(days) as { count: number };

  // Top search queries
  const topSearches = db.prepare(`
    SELECT search_query, COUNT(*) as count 
    FROM product_searches 
    WHERE created_at >= datetime('now', '-' || ? || ' days')
    GROUP BY search_query 
    ORDER BY count DESC 
    LIMIT 10
  `).all(days) as Array<{ search_query: string; count: number }>;

  // Top missing product requests
  const topMissing = db.prepare(`
    SELECT search_query, COUNT(*) as count 
    FROM missing_products 
    WHERE created_at >= datetime('now', '-' || ? || ' days')
    GROUP BY search_query 
    ORDER BY count DESC 
    LIMIT 10
  `).all(days) as Array<{ search_query: string; count: number }>;

  // Messages per day
  const messagesPerDay = db.prepare(`
    SELECT DATE(created_at) as date, COUNT(*) as count 
    FROM chat_messages 
    WHERE created_at >= datetime('now', '-' || ? || ' days')
    GROUP BY DATE(created_at) 
    ORDER BY date DESC
  `).all(days) as Array<{ date: string; count: number }>;

  return {
    totalMessages: totalMessages.count,
    totalSessions: totalSessions.count,
    totalSearches: totalSearches.count,
    missingProducts: missingProducts.count,
    topSearches,
    topMissing,
    messagesPerDay,
  };
}

