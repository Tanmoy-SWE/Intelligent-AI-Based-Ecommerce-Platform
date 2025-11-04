#!/usr/bin/env node

/**
 * Script to reinitialize product embeddings in Pinecone
 * This will clear all old embeddings and upload fresh ones with all products
 * 
 * Usage: node scripts/reinitialize-embeddings.js
 */

const API_URL = 'http://localhost:3000/api/assistant/init';

async function reinitializeEmbeddings() {
  console.log('🔄 Starting embeddings reinitialization...\n');

  try {
    console.log('📡 Sending reinitialize request to API...');
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'reinitialize',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to reinitialize embeddings');
    }

    const result = await response.json();
    
    console.log('\n✅ Success!');
    console.log(`📦 ${result.count} products embedded and uploaded to Pinecone`);
    console.log(`💬 ${result.message}\n`);
    
    console.log('🎉 Reinitialization complete!');
    console.log('💡 Refresh your browser to see the updated product count.\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\n💡 Make sure:');
    console.error('   1. Your Next.js dev server is running (npm run dev)');
    console.error('   2. The server is accessible at http://localhost:3000');
    console.error('   3. Your Pinecone API key is configured in .env.local\n');
    process.exit(1);
  }
}

// Run the script
reinitializeEmbeddings();

