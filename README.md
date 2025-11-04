# 🛍️ Intelligent AI-Based E-Commerce Platform

An advanced, production-ready e-commerce platform powered by **Next.js 15**, **OpenAI GPT-4o-mini**, and **Pinecone Vector Database**. Features an intelligent AI shopping assistant with real-time streaming responses, semantic product search, and comprehensive analytics dashboard.

![Next.js](https://img.shields.io/badge/Next.js-15.3.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-green)
![Pinecone](https://img.shields.io/badge/Pinecone-Vector%20DB-orange)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🌐 **Live Demo**

**🚀 [View Live Application](https://intelligent-ai-based-ecommerce-plat-dusky.vercel.app/)**

Experience the AI-powered shopping assistant in action! Try asking:
- "Do you have hoodies?"
- "Show me winter clothing"
- "I need something warm"

---

## 🌟 **Key Features**

### **🤖 AI Shopping Assistant**
- **Real-time Streaming Responses** - Word-by-word streaming for natural conversation flow
- **Semantic Product Search** - Vector-based search using OpenAI embeddings (1536 dimensions)
- **Intelligent Intent Detection** - Automatically detects product search vs. general conversation
- **Query Expansion** - Expands user queries with related terms (e.g., "winter" → "warm hoodie fleece jacket")
- **Fallback Mode** - Graceful degradation with text-based matching when OpenAI API is unavailable
- **Anti-Hallucination** - Prevents AI from inventing non-existent products

### **📊 Admin Analytics Dashboard**
- **Real-time Metrics** - Track searches, conversations, and product views
- **AI-Generated Insights** - Automated business recommendations using GPT-4o-mini
- **Missing Product Tracking** - Identify customer demand for products not in catalog
- **Hot Products Analysis** - Discover trending products based on search patterns
- **Conversion Tracking** - Monitor search-to-view conversion rates

### **🎨 Modern UI/UX**
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Dark Mode Support** - Automatic theme switching
- **Loading Animations** - Smooth transitions and skeleton loaders
- **Product Cards** - Emoji fallbacks for products without images
- **Chat Widget** - Persistent bottom-right chat interface

### **⚡ Performance & Scalability**
- **Next.js 15 App Router** - Server Components, Server Actions, React 19
- **Turbopack** - Lightning-fast development builds
- **Partial Prerendering (PPR)** - Hybrid static/dynamic rendering
- **Edge-Ready** - Optimized for Vercel Edge Network
- **SQLite Analytics** - Lightweight local database for analytics

---

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ and npm
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- Pinecone API key ([Get one here](https://www.pinecone.io/))

### **Installation**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Tanmoy-SWE/Intelligent-AI-Based-Ecommerce-Platform.git
   cd Intelligent-AI-Based-Ecommerce-Platform
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env.local` file in the root directory:
   ```bash
   # Company Information
   COMPANY_NAME="Acme Store"
   SITE_NAME="Acme Store"
   TWITTER_CREATOR="@acmestore"
   TWITTER_SITE="https://acmestore.com"

   # API Keys
   OPENAI_API_KEY="your-openai-api-key-here"
   PINECONE_API_KEY="your-pinecone-api-key-here"
   PINECONE_INDEX_NAME="ecommerce-products"
   PINECONE_ENVIRONMENT="us-east-1"

   # Admin Credentials
   ADMIN_USERNAME="admin"
   ADMIN_PASSWORD="your-secure-password"
   ```

4. **Initialize product embeddings:**
   ```bash
   npm run dev
   ```

   Then in another terminal:
   ```bash
   curl -X POST http://localhost:3000/api/assistant/init
   ```

5. **Open your browser:**
   ```
   http://localhost:3000
   ```

---

## 📁 **Project Structure**

```
├── app/                          # Next.js 15 App Router
│   ├── page.tsx                  # Homepage with product catalog
│   ├── product/[handle]/         # Dynamic product pages
│   ├── admin/                    # Admin dashboard
│   │   └── dashboard/            # Analytics & insights
│   └── api/                      # API routes
│       ├── assistant/            # AI assistant endpoints
│       │   ├── chat-stream/      # Streaming chat API
│       │   └── init/             # Embeddings initialization
│       └── admin/                # Admin API endpoints
├── components/                   # React components
│   ├── assistant/                # AI chat components
│   │   ├── chat-widget.tsx       # Main chat interface
│   │   └── product-card.tsx      # Product recommendation cards
│   ├── cart/                     # Shopping cart components
│   ├── grid/                     # Product grid components
│   └── layout/                   # Layout components
├── lib/                          # Core business logic
│   ├── ai/                       # AI & ML logic
│   │   ├── assistant.ts          # Main assistant logic
│   │   ├── embeddings.ts         # Vector embeddings
│   │   └── insights-generator.ts # AI insights generation
│   ├── db/                       # Database logic
│   │   ├── database.ts           # SQLite operations
│   │   └── schema.sql            # Database schema
│   ├── shopify/                  # Shopify integration
│   └── mock-products.ts          # Mock product data (29 products)
├── public/                       # Static assets
│   └── products/                 # Product images
├── .env.local                    # Environment variables (gitignored)
└── README.md                     # This file
```


---

## 🔧 **Configuration**

### **Pinecone Setup**

1. Create a Pinecone index with these settings:
   - **Dimension:** 1536 (for OpenAI `text-embedding-3-small`)
   - **Metric:** Cosine similarity
   - **Cloud:** AWS
   - **Region:** us-east-1

2. Update `.env.local` with your Pinecone credentials

### **OpenAI Setup**

1. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add to `.env.local` as `OPENAI_API_KEY`

### **Admin Dashboard**

Access the admin dashboard at `/admin`:
- **Username:** Set in `ADMIN_USERNAME` env variable
- **Password:** Set in `ADMIN_PASSWORD` env variable

---

## 🎯 **Usage**

### **AI Shopping Assistant**

1. **Open the chat widget** (bottom-right corner)
2. **Ask questions** like:
   - "Do you have hoodies?"
   - "Show me winter clothing"
   - "I need something warm"
   - "What t-shirts do you have?"

3. **Get recommendations** with product cards
4. **Click products** to view details

### **Admin Dashboard**

1. Navigate to `/admin`
2. Login with admin credentials
3. View analytics:
   - Total searches, conversations, product views
   - Search-to-view conversion rate
   - Most searched products
   - Missing product requests
4. Get AI-generated insights and recommendations

---

## 🧪 **Testing**

### **Test AI Assistant**
```bash
node test-assistant.js
```

### **Test Embeddings**
```bash
node demo-queries.js
```

### **Reinitialize Embeddings**
```bash
curl -X POST http://localhost:3000/api/assistant/init \
  -H "Content-Type: application/json" \
  -d '{"action": "reinitialize"}'
```

---

## 🚢 **Deployment**

### **Deploy to Vercel**

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables from `.env.local`

3. **Deploy:**
   - Vercel will automatically build and deploy
   - Your app will be live at `https://your-app.vercel.app`

### **Environment Variables on Vercel**

Add these in Vercel Dashboard → Settings → Environment Variables:
- `OPENAI_API_KEY`
- `PINECONE_API_KEY`
- `PINECONE_INDEX_NAME`
- `PINECONE_ENVIRONMENT`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `COMPANY_NAME`
- `SITE_NAME`

---

## 🛠️ **Tech Stack**

### **Frontend**
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Headless UI** - Accessible components

### **Backend**
- **Next.js API Routes** - Serverless functions
- **Server Actions** - Server-side mutations
- **SQLite** - Analytics database

### **AI & ML**
- **OpenAI GPT-4o-mini** - Chat completions & embeddings
- **Pinecone** - Vector database for semantic search
- **RAG Pattern** - Retrieval Augmented Generation

### **DevOps**
- **Vercel** - Hosting & deployment
- **Turbopack** - Fast bundler
- **ESLint** - Code linting
- **Prettier** - Code formatting

---

## 📊 **Features Deep Dive**

### **1. Semantic Product Search**

The platform uses **vector embeddings** for intelligent product search:

```typescript
// User query: "warm winter clothing"
// ↓ Expanded to: "warm winter clothing hoodie fleece jacket beanie"
// ↓ Converted to 1536-dimensional vector
// ↓ Compared with product embeddings using cosine similarity
// ↓ Returns: Hoodies, Jackets, Beanies (sorted by relevance)
```

**Similarity Threshold:** 30% (configurable in `lib/ai/assistant.ts`)

### **2. Fallback Mode**

When OpenAI API is unavailable, the system automatically falls back to text-based matching:

```typescript
// Normal mode: OpenAI embeddings + GPT-4o-mini responses
// ↓ API fails
// Fallback mode: Text matching + template responses
```

**Fallback Features:**
- ✅ Text-based product search (exact phrase + word matching)
- ✅ Template-based responses (greetings, thanks, product results)
- ✅ Graceful degradation (no crashes)
- ✅ Automatic recovery when API is restored

### **3. Real-time Streaming**

Chat responses stream word-by-word for natural conversation:

```typescript
// Server-Sent Events (SSE) stream
yield { type: 'token', content: 'Hello' }
yield { type: 'token', content: ' there!' }
yield { type: 'products', products: [...] }
yield { type: 'done' }
```

---

## 🔐 **Security**

- ✅ Environment variables for sensitive data
- ✅ Admin authentication with username/password
- ✅ API rate limiting (via Vercel)
- ✅ Input validation and sanitization
- ✅ HTTPS enforced on production

---

## 📈 **Performance**

- **First Load JS:** ~117 kB (gzipped)
- **Lighthouse Score:** 95+ (Performance, Accessibility, Best Practices, SEO)
- **Time to Interactive:** <2s on 3G
- **Core Web Vitals:** All green

---

## 🤝 **Contributing**

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 **Author**

**Tanmoy-SWE**
- GitHub: [@Tanmoy-SWE](https://github.com/Tanmoy-SWE)
- Repository: [Intelligent-AI-Based-Ecommerce-Platform](https://github.com/Tanmoy-SWE/Intelligent-AI-Based-Ecommerce-Platform)

---

## 🙏 **Acknowledgments**

- [Vercel](https://vercel.com) for Next.js and hosting
- [OpenAI](https://openai.com) for GPT-4o-mini and embeddings
- [Pinecone](https://pinecone.io) for vector database
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Headless UI](https://headlessui.com) for accessible components

---

## 📞 **Support**

If you have any questions or need help, please:
- Open an issue on GitHub
- Check existing documentation in project files
- Review the code comments for implementation details

---

**Built with ❤️ using Next.js 15 and AI**

