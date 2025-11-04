import {
    areEmbeddingsInitialized,
    cacheProducts,
    clearAllEmbeddings,
    generateAllProductEmbeddings,
    getEmbeddingCount,
    storeEmbeddings
} from 'lib/ai/embeddings';
import { mockProducts } from 'lib/mock-products';
import { getProducts } from 'lib/shopify';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Initialize product embeddings
 * GET /api/assistant/init
 */
export async function GET() {
  try {
    // Check if already initialized
    const initialized = await areEmbeddingsInitialized();
    if (initialized) {
      const count = await getEmbeddingCount();
      return NextResponse.json({
        success: true,
        message: 'Embeddings already initialized in Pinecone',
        count: count,
      });
    }

    // Fetch all products from Shopify or use mock data
    console.log('Fetching products...');
    let products;

    try {
      products = await getProducts({});
    } catch (error) {
      console.log('Shopify not configured, using mock products');
      products = mockProducts;
    }

    if (!products || products.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No products found in the catalog',
        },
        { status: 404 }
      );
    }

    console.log(`Found ${products.length} products. Generating embeddings...`);

    // Generate embeddings for all products
    const embeddings = await generateAllProductEmbeddings(products);

    // Store embeddings in Pinecone
    await storeEmbeddings(embeddings, products);

    // Cache products for quick access
    cacheProducts(products);

    return NextResponse.json({
      success: true,
      message: 'Product embeddings initialized successfully in Pinecone',
      count: embeddings.length,
    });
  } catch (error) {
    console.error('Error initializing embeddings:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to initialize embeddings',
      },
      { status: 500 }
    );
  }
}

/**
 * Get initialization status
 * POST /api/assistant/init (with action: 'status')
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.action === 'status') {
      const initialized = await areEmbeddingsInitialized();
      const count = await getEmbeddingCount();
      return NextResponse.json({
        initialized: initialized,
        count: count,
      });
    }

    if (body.action === 'reinitialize') {
      // Force reinitialization - clear old data first
      console.log('Clearing old embeddings from Pinecone...');
      await clearAllEmbeddings();

      let products;
      try {
        products = await getProducts({});
      } catch (error) {
        console.log('Shopify not configured, using mock products');
        products = mockProducts;
      }

      console.log(`Generating embeddings for ${products.length} products...`);
      const embeddings = await generateAllProductEmbeddings(products);

      console.log('Storing embeddings in Pinecone...');
      await storeEmbeddings(embeddings, products);
      cacheProducts(products);

      return NextResponse.json({
        success: true,
        message: 'Embeddings reinitialized successfully in Pinecone',
        count: embeddings.length,
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in init POST:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

