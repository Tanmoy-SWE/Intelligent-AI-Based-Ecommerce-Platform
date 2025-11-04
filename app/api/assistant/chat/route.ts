import { ChatMessage, generateAssistantResponse } from 'lib/ai/assistant';
import { areEmbeddingsInitialized } from 'lib/ai/embeddings';
import { saveChatMessage, saveMissingProduct, saveProductSearch } from 'lib/db/database';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export interface ChatRequest {
  message: string;
  history?: ChatMessage[];
  sessionId?: string;
}

export interface ChatResponse {
  success: boolean;
  message?: string;
  products?: Array<{
    productId: string;
    productHandle: string;
    title: string;
    description: string;
    price: string;
    availableForSale: boolean;
    tags: string[];
  }>;
  error?: string;
}

/**
 * Chat with the AI assistant
 * POST /api/assistant/chat
 */
export async function POST(request: Request): Promise<NextResponse<ChatResponse>> {
  try {
    // Check if embeddings are initialized
    if (!areEmbeddingsInitialized()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Assistant not initialized. Please wait while we load the product catalog.',
        },
        { status: 503 }
      );
    }

    const body: ChatRequest = await request.json();

    if (!body.message || body.message.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Message is required',
        },
        { status: 400 }
      );
    }

    // Generate session ID if not provided
    const sessionId = body.sessionId || `session-${Date.now()}`;

    // Save user message to database
    const userMessageId = saveChatMessage(sessionId, 'user', body.message);

    // Generate response
    const response = await generateAssistantResponse(
      body.message,
      body.history || []
    );

    // Save assistant response to database
    saveChatMessage(sessionId, 'assistant', response.message);

    // Format products for response
    const products = response.products.map(p => ({
      productId: p.productId,
      productHandle: p.productHandle,
      title: p.metadata.title,
      description: p.metadata.description,
      price: p.metadata.price,
      availableForSale: p.metadata.availableForSale,
      tags: p.metadata.tags,
    }));

    // Track product search
    const productIds = response.products.map(p => p.productId);
    saveProductSearch(sessionId, userMessageId, body.message, products.length, productIds);

    // Track missing products (if user is searching but no products found)
    console.log('🔍 Missing Product Check:', {
      productsFound: response.products.length,
      isProductSearch: response.isProductSearch,
      query: body.message,
      willTrack: response.products.length === 0 && response.isProductSearch
    });

    if (response.products.length === 0 && response.isProductSearch) {
      console.log('✅ Tracking missing product:', body.message);
      saveMissingProduct(sessionId, userMessageId, body.message);
    }

    return NextResponse.json({
      success: true,
      message: response.message,
      products,
      sessionId, // Return session ID to client
    });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process your message',
      },
      { status: 500 }
    );
  }
}

