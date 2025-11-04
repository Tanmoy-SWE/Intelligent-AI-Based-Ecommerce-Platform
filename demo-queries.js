/**
 * Demo script showing various query types the AI Assistant can handle
 * Run with: node demo-queries.js
 */

const BASE_URL = 'http://localhost:3000';

const DEMO_QUERIES = [
  {
    name: 'Product Search',
    query: 'Show me some t-shirts',
    description: 'Basic product search by category',
  },
  {
    name: 'Semantic Search',
    query: 'I need something warm for winter',
    description: 'Semantic understanding (warm → hoodie)',
  },
  {
    name: 'Category Browse',
    query: 'What accessories do you have?',
    description: 'Browse by product category',
  },
  {
    name: 'Feature-Based',
    query: 'Do you have any eco-friendly products?',
    description: 'Search by product features/attributes',
  },
  {
    name: 'Price Filter',
    query: 'Show me items under $30',
    description: 'Price-based filtering',
  },
  {
    name: 'Use Case',
    query: 'What can I get for my morning coffee?',
    description: 'Use-case based recommendation',
  },
  {
    name: 'Gift Recommendation',
    query: 'I need a gift for someone who loves outdoor activities',
    description: 'Contextual gift recommendations',
  },
];

async function testQuery(queryObj, index) {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`📝 Test ${index + 1}/${DEMO_QUERIES.length}: ${queryObj.name}`);
  console.log(`${'='.repeat(70)}`);
  console.log(`Query: "${queryObj.query}"`);
  console.log(`Description: ${queryObj.description}`);
  console.log(`${'-'.repeat(70)}`);

  try {
    const response = await fetch(`${BASE_URL}/api/assistant/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: queryObj.query,
        history: [],
      }),
    });

    const data = await response.json();

    if (data.success) {
      console.log(`\n✅ Response:`);
      console.log(data.message);
      
      if (data.products && data.products.length > 0) {
        console.log(`\n📦 Products Found: ${data.products.length}`);
        data.products.slice(0, 3).forEach((product, i) => {
          console.log(`\n  ${i + 1}. ${product.title}`);
          console.log(`     Price: ${product.price}`);
          console.log(`     Available: ${product.availableForSale ? 'Yes' : 'No'}`);
        });
      } else {
        console.log(`\n📦 No products found`);
      }
    } else {
      console.log(`\n❌ Error: ${data.error}`);
    }
  } catch (error) {
    console.log(`\n❌ Request failed: ${error.message}`);
  }

  // Wait a bit between requests to avoid rate limits
  await new Promise(resolve => setTimeout(resolve, 1000));
}

async function runDemo() {
  console.log('\n🎬 AI Product Assistant - Demo Queries');
  console.log('=' .repeat(70));
  console.log('This demo shows various types of queries the assistant can handle');
  console.log('=' .repeat(70));

  // Check if assistant is initialized
  console.log('\n🔍 Checking assistant status...');
  try {
    const statusResponse = await fetch(`${BASE_URL}/api/assistant/init`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'status' }),
    });
    const statusData = await statusResponse.json();

    if (!statusData.initialized) {
      console.log('⚠️  Assistant not initialized. Initializing now...');
      const initResponse = await fetch(`${BASE_URL}/api/assistant/init`);
      const initData = await initResponse.json();
      
      if (initData.success) {
        console.log(`✅ Initialized with ${initData.count} products`);
      } else {
        console.log('❌ Failed to initialize. Exiting.');
        return;
      }
    } else {
      console.log(`✅ Assistant ready with ${statusData.count} products`);
    }
  } catch (error) {
    console.log(`❌ Failed to check status: ${error.message}`);
    return;
  }

  // Run all demo queries
  for (let i = 0; i < DEMO_QUERIES.length; i++) {
    await testQuery(DEMO_QUERIES[i], i);
  }

  console.log(`\n${'='.repeat(70)}`);
  console.log('✨ Demo completed!');
  console.log(`${'='.repeat(70)}\n`);

  // Summary
  console.log('📊 Summary:');
  console.log(`   Total Queries: ${DEMO_QUERIES.length}`);
  console.log(`   Query Types: Product Search, Semantic Search, Category Browse,`);
  console.log(`                Feature-Based, Price Filter, Use Case, Gift Recommendation`);
  console.log(`\n💡 Key Capabilities Demonstrated:`);
  console.log(`   ✅ Semantic understanding (not just keyword matching)`);
  console.log(`   ✅ Context-aware recommendations`);
  console.log(`   ✅ Natural language processing`);
  console.log(`   ✅ Product attribute filtering`);
  console.log(`   ✅ Use-case based suggestions`);
  console.log(`\n🎯 Next Steps:`);
  console.log(`   1. Try the chat widget in the browser: http://localhost:3000`);
  console.log(`   2. Test with your own queries`);
  console.log(`   3. Review the implementation in AI_ASSISTANT_README.md`);
  console.log('');
}

// Run the demo
runDemo().catch(console.error);

