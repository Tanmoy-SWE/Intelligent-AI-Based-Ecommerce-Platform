/**
 * Simple test script to verify the AI Assistant API endpoints
 * Run with: node test-assistant.js
 */

const BASE_URL = 'http://localhost:3000';

async function testInitEndpoint() {
  console.log('\n🧪 Testing /api/assistant/init endpoint...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/assistant/init`);
    const data = await response.json();
    
    console.log('✅ Init Response:', JSON.stringify(data, null, 2));
    return data.success;
  } catch (error) {
    console.error('❌ Init Error:', error.message);
    return false;
  }
}

async function testChatEndpoint() {
  console.log('\n🧪 Testing /api/assistant/chat endpoint...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/assistant/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Show me some t-shirts',
        history: [],
      }),
    });
    
    const data = await response.json();
    
    console.log('✅ Chat Response:');
    console.log('  Message:', data.message);
    console.log('  Products Found:', data.products?.length || 0);
    if (data.products && data.products.length > 0) {
      console.log('  First Product:', data.products[0].title);
    }
    
    return data.success;
  } catch (error) {
    console.error('❌ Chat Error:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting AI Assistant API Tests...');
  console.log('📍 Base URL:', BASE_URL);
  
  // Test 1: Initialize embeddings
  const initSuccess = await testInitEndpoint();
  
  if (!initSuccess) {
    console.log('\n⚠️  Initialization failed. Skipping chat test.');
    return;
  }
  
  // Wait a bit for embeddings to be ready
  console.log('\n⏳ Waiting 2 seconds for embeddings to be ready...');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test 2: Chat endpoint
  await testChatEndpoint();
  
  console.log('\n✨ Tests completed!\n');
}

// Run tests
runTests().catch(console.error);

