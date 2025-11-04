import { getDatabase } from './database';

/**
 * Get raw data for AI insights generation
 */
export function getInsightsData(days = 7) {
  const db = getDatabase();

  // Get all user messages (not assistant responses)
  const userMessages = db
    .prepare(
      `
    SELECT content, created_at 
    FROM chat_messages 
    WHERE role = 'user' 
    AND created_at >= datetime('now', '-' || ? || ' days')
    ORDER BY created_at DESC
  `
    )
    .all(days) as Array<{ content: string; created_at: string }>;

  // Get product searches with results
  const productSearches = db
    .prepare(
      `
    SELECT search_query, products_found, top_products, created_at
    FROM product_searches
    WHERE created_at >= datetime('now', '-' || ? || ' days')
    ORDER BY created_at DESC
  `
    )
    .all(days) as Array<{
    search_query: string;
    products_found: number;
    top_products: string | null;
    created_at: string;
  }>;

  // Get missing product requests
  const missingProducts = db
    .prepare(
      `
    SELECT search_query, created_at
    FROM missing_products
    WHERE created_at >= datetime('now', '-' || ? || ' days')
    ORDER BY created_at DESC
  `
    )
    .all(days) as Array<{ search_query: string; created_at: string }>;

  return {
    userMessages,
    productSearches,
    missingProducts,
  };
}

/**
 * Get summary statistics for insights
 */
export function getInsightsSummary(days = 7) {
  const db = getDatabase();

  // Total queries
  const totalQueries = db
    .prepare(
      "SELECT COUNT(*) as count FROM chat_messages WHERE role = 'user' AND created_at >= datetime('now', '-' || ? || ' days')"
    )
    .get(days) as { count: number };

  // Successful searches (found products)
  const successfulSearches = db
    .prepare(
      "SELECT COUNT(*) as count FROM product_searches WHERE products_found > 0 AND created_at >= datetime('now', '-' || ? || ' days')"
    )
    .get(days) as { count: number };

  // Failed searches (no products found)
  const failedSearches = db
    .prepare(
      "SELECT COUNT(*) as count FROM missing_products WHERE created_at >= datetime('now', '-' || ? || ' days')"
    )
    .get(days) as { count: number };

  // Average products per search
  const avgProducts = db
    .prepare(
      "SELECT AVG(products_found) as avg FROM product_searches WHERE created_at >= datetime('now', '-' || ? || ' days')"
    )
    .get(days) as { avg: number | null };

  return {
    totalQueries: totalQueries.count,
    successfulSearches: successfulSearches.count,
    failedSearches: failedSearches.count,
    avgProductsPerSearch: avgProducts.avg || 0,
    successRate:
      totalQueries.count > 0
        ? ((successfulSearches.count / totalQueries.count) * 100).toFixed(1)
        : '0',
  };
}

