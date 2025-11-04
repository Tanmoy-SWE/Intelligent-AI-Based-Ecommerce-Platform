import { Pinecone } from '@pinecone-database/pinecone';
import { Product } from 'lib/shopify/types';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Initialize Pinecone client
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const INDEX_NAME = 'commerce-products';
const DIMENSION = 1536; // text-embedding-3-small dimension

export interface ProductEmbedding {
  productId: string;
  productHandle: string;
  embedding: number[];
  metadata: {
    title: string;
    description: string;
    price: string;
    tags: string[];
    availableForSale: boolean;
  };
  similarity?: number; // Optional similarity score from search results
}

// Cache for product data (Pinecone only stores vectors, we need full product data)
let productCache: Map<string, Product> = new Map();

/**
 * Initialize or get Pinecone index
 */
async function getOrCreateIndex() {
  try {
    // Check if index exists
    const indexes = await pinecone.listIndexes();
    const indexExists = indexes.indexes?.some(idx => idx.name === INDEX_NAME);

    if (!indexExists) {
      console.log(`Creating Pinecone index: ${INDEX_NAME}`);
      await pinecone.createIndex({
        name: INDEX_NAME,
        dimension: DIMENSION,
        metric: 'cosine',
        spec: {
          serverless: {
            cloud: 'aws',
            region: 'us-east-1',
          },
        },
      });

      // Wait for index to be ready
      console.log('Waiting for index to be ready...');
      await new Promise(resolve => setTimeout(resolve, 10000));
    }

    return pinecone.index(INDEX_NAME);
  } catch (error) {
    console.error('Error getting/creating Pinecone index:', error);
    throw error;
  }
}

/**
 * Generate embedding for a single product
 */
export async function generateProductEmbedding(product: Product): Promise<ProductEmbedding> {
  // Create a rich text representation of the product
  const productText = `
    Title: ${product.title}
    Description: ${product.description}
    Price: ${product.priceRange.minVariantPrice.amount} ${product.priceRange.minVariantPrice.currencyCode}
    Tags: ${product.tags.join(', ')}
    Available: ${product.availableForSale ? 'Yes' : 'No'}
  `.trim();

  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: productText,
  });

  return {
    productId: product.id,
    productHandle: product.handle,
    embedding: response.data[0]?.embedding || [],
    metadata: {
      title: product.title,
      description: product.description,
      price: `${product.priceRange.minVariantPrice.amount} ${product.priceRange.minVariantPrice.currencyCode}`,
      tags: product.tags,
      availableForSale: product.availableForSale,
    },
  };
}

/**
 * Generate embeddings for all products
 */
export async function generateAllProductEmbeddings(products: Product[]): Promise<ProductEmbedding[]> {
  console.log(`Generating embeddings for ${products.length} products...`);
  
  const embeddings: ProductEmbedding[] = [];
  
  // Process in batches to avoid rate limits
  const batchSize = 10;
  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    const batchEmbeddings = await Promise.all(
      batch.map(product => generateProductEmbedding(product))
    );
    embeddings.push(...batchEmbeddings);
    console.log(`Processed ${Math.min(i + batchSize, products.length)}/${products.length} products`);
  }
  
  return embeddings;
}

/**
 * Clear all embeddings from Pinecone
 */
export async function clearAllEmbeddings(): Promise<void> {
  try {
    const index = await getOrCreateIndex();

    // Delete all vectors from the index
    await index.deleteAll();

    // Clear the product cache
    productCache.clear();

    console.log('✅ Cleared all embeddings from Pinecone');
  } catch (error) {
    console.error('Error clearing embeddings from Pinecone:', error);
    throw error;
  }
}

/**
 * Store embeddings in Pinecone
 */
export async function storeEmbeddings(embeddings: ProductEmbedding[], products: Product[]): Promise<void> {
  try {
    const index = await getOrCreateIndex();

    // Prepare vectors for Pinecone
    const vectors = embeddings.map((emb, idx) => ({
      id: emb.productId,
      values: emb.embedding,
      metadata: {
        handle: emb.productHandle,
        title: emb.metadata.title,
        description: emb.metadata.description,
        price: emb.metadata.price,
        tags: emb.metadata.tags.join(','),
        availableForSale: emb.metadata.availableForSale,
      },
    }));

    // Upsert vectors in batches
    const batchSize = 100;
    for (let i = 0; i < vectors.length; i += batchSize) {
      const batch = vectors.slice(i, i + batchSize);
      await index.upsert(batch);
      console.log(`Uploaded ${Math.min(i + batchSize, vectors.length)}/${vectors.length} vectors to Pinecone`);
    }

    // Cache product data
    products.forEach(product => {
      productCache.set(product.id, product);
    });

    console.log(`✅ Stored ${embeddings.length} product embeddings in Pinecone`);
  } catch (error) {
    console.error('Error storing embeddings in Pinecone:', error);
    throw error;
  }
}

/**
 * Get embedding count from Pinecone
 */
export async function getEmbeddingCount(): Promise<number> {
  try {
    const index = await getOrCreateIndex();
    const stats = await index.describeIndexStats();
    return stats.totalRecordCount || 0;
  } catch (error) {
    console.error('Error getting embedding count:', error);
    return 0;
  }
}

/**
 * Search for products using Pinecone vector similarity
 *
 * @param query - The search query
 * @param topK - Maximum number of results to return
 * @param minSimilarity - Minimum similarity threshold (0-1). Default: 0.5
 * @returns Array of products that match the query above the similarity threshold
 */
export async function searchProducts(
  query: string,
  topK: number = 5,
  minSimilarity: number = 0.5
): Promise<ProductEmbedding[]> {
  try {
    const index = await getOrCreateIndex();

    // Generate embedding for the query
    const queryEmbeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: query,
    });

    const queryEmbedding = queryEmbeddingResponse.data[0]?.embedding || [];

    // Query Pinecone
    const queryResponse = await index.query({
      vector: queryEmbedding,
      topK: topK,
      includeMetadata: true,
    });

    // Convert Pinecone results to ProductEmbedding format
    const allResults: ProductEmbedding[] = queryResponse.matches.map(match => ({
      productId: match.id,
      productHandle: (match.metadata?.handle as string) || '',
      embedding: [], // We don't need to return the full embedding
      metadata: {
        title: (match.metadata?.title as string) || '',
        description: (match.metadata?.description as string) || '',
        price: (match.metadata?.price as string) || '',
        tags: ((match.metadata?.tags as string) || '').split(',').filter(Boolean),
        availableForSale: (match.metadata?.availableForSale as boolean) || false,
      },
      similarity: match.score || 0,
    }));

    // Filter by similarity threshold
    const filteredResults = allResults.filter(result => (result.similarity || 0) >= minSimilarity);

    console.log(`🔍 Search: "${query}" | Found: ${allResults.length} total, ${filteredResults.length} above threshold (${minSimilarity})`);
    if (allResults.length > 0 && allResults[0]) {
      console.log(`   Top result: "${allResults[0].metadata.title}" (similarity: ${allResults[0].similarity?.toFixed(3)})`);
    }

    return filteredResults;
  } catch (error) {
    console.error('Error searching products in Pinecone:', error);
    throw error;
  }
}

/**
 * Check if embeddings are initialized in Pinecone
 */
export async function areEmbeddingsInitialized(): Promise<boolean> {
  try {
    const count = await getEmbeddingCount();
    return count > 0;
  } catch (error) {
    console.error('Error checking if embeddings are initialized:', error);
    return false;
  }
}

/**
 * Get product from cache
 */
export function getProductFromCache(productId: string): Product | undefined {
  return productCache.get(productId);
}

/**
 * Cache products for quick access
 */
export function cacheProducts(products: Product[]): void {
  products.forEach(product => {
    productCache.set(product.id, product);
  });
  console.log(`Cached ${products.length} products`);
}

