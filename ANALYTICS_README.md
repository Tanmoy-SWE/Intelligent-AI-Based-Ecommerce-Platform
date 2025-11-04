# 📊 Analytics Dashboard

## Overview

The analytics system tracks all user interactions with the AI shopping assistant, providing insights into:
- What users are searching for
- Which products are popular
- What products users want but aren't available
- Chat activity over time

## Features

### 🔐 Admin Login
- Simple authentication system
- Default credentials: `admin` / `admin`
- Token-based session management

### 📈 Analytics Dashboard
- **Total Messages** - Track conversation volume
- **Chat Sessions** - Number of unique user sessions
- **Product Searches** - How many times users searched for products
- **Missing Products** - Requests for unavailable products

### 📊 Insights
- **Top Search Queries** - Most popular search terms
- **Missing Product Requests** - What users want but can't find
- **Messages Per Day** - Activity trends over time
- **Time Range Filters** - View data for 1, 7, 30, or 90 days

## Database Schema

The system uses SQLite with the following tables:

### `chat_sessions`
- `id` - Unique session identifier
- `created_at` - Session start time
- `last_activity` - Last message timestamp

### `chat_messages`
- `id` - Auto-increment message ID
- `session_id` - Foreign key to chat_sessions
- `role` - 'user' or 'assistant'
- `content` - Message text
- `created_at` - Message timestamp

### `product_searches`
- `id` - Auto-increment search ID
- `session_id` - Foreign key to chat_sessions
- `message_id` - Foreign key to chat_messages
- `search_query` - User's search query
- `products_found` - Number of products returned
- `top_products` - JSON array of product IDs
- `created_at` - Search timestamp

### `missing_products`
- `id` - Auto-increment ID
- `session_id` - Foreign key to chat_sessions
- `message_id` - Foreign key to chat_messages
- `search_query` - User's query that found no products
- `created_at` - Request timestamp

## Usage

### Accessing the Admin Dashboard

1. **Navigate to the admin login page:**
   ```
   http://localhost:3000/admin
   ```

2. **Login with default credentials:**
   - Username: `admin`
   - Password: `admin`

3. **View analytics:**
   - After login, you'll be redirected to `/admin/dashboard`
   - Select time range (1, 7, 30, or 90 days)
   - View stats, charts, and insights

### API Endpoints

#### Login
```
POST /api/admin/login
Body: { "username": "admin", "password": "admin" }
Response: { "success": true, "token": "..." }
```

#### Get Analytics
```
GET /api/admin/analytics?days=7
Headers: { "Authorization": "Bearer <token>" }
Response: { "success": true, "data": { ... } }
```

## Data Tracking

### Automatic Tracking

The system automatically tracks:

1. **Every user message** - Saved to `chat_messages` table
2. **Every assistant response** - Saved to `chat_messages` table
3. **Product searches** - When user asks for products
4. **Missing products** - When search returns no results

### Session Management

- Each chat widget generates a unique session ID
- Session ID persists for the duration of the page session
- New session created on page refresh

## Database Location

The SQLite database is stored at:
```
/data/analytics.db
```

This directory is automatically created on first run and is excluded from git.

## Security Notes

⚠️ **Important:** This is a simple implementation for demonstration purposes.

For production use, you should:

1. **Use proper authentication:**
   - Replace simple username/password with OAuth or JWT
   - Hash passwords with bcrypt
   - Implement rate limiting

2. **Secure the database:**
   - Use environment variables for credentials
   - Implement proper access controls
   - Consider using PostgreSQL or MySQL for production

3. **Add middleware:**
   - Implement proper auth middleware
   - Add CORS protection
   - Add request validation

4. **Encrypt sensitive data:**
   - Encrypt user messages if they contain PII
   - Use HTTPS in production
   - Implement data retention policies

## Customization

### Changing Admin Credentials

Edit `app/api/admin/login/route.ts`:

```typescript
const ADMIN_USERNAME = 'your-username';
const ADMIN_PASSWORD = 'your-password';
```

### Adjusting Analytics Queries

Edit `lib/db/database.ts` to modify the `getAnalytics()` function:

```typescript
export function getAnalytics(days = 7) {
  // Add custom queries here
}
```

### Adding New Metrics

1. Add new table to `lib/db/schema.sql`
2. Create helper functions in `lib/db/database.ts`
3. Update analytics API in `app/api/admin/analytics/route.ts`
4. Display in dashboard at `app/admin/dashboard/page.tsx`

## Troubleshooting

### Database not initializing

If you see errors about the database:

1. Check that the `data` directory exists
2. Ensure write permissions
3. Delete `data/analytics.db` and restart the server

### Analytics not showing data

1. Make sure you've had some chat conversations
2. Check the time range filter
3. Verify database has data:
   ```bash
   sqlite3 data/analytics.db "SELECT COUNT(*) FROM chat_messages;"
   ```

### Login not working

1. Clear browser localStorage
2. Check browser console for errors
3. Verify API endpoint is accessible

## Future Enhancements

Potential improvements:

- [ ] Export analytics to CSV/PDF
- [ ] Real-time dashboard updates
- [ ] User sentiment analysis
- [ ] Product recommendation insights
- [ ] A/B testing support
- [ ] Email reports
- [ ] Multi-user admin support
- [ ] Role-based access control
- [ ] Advanced filtering and search
- [ ] Data visualization improvements

## License

This analytics system is part of the Next.js Commerce project.

