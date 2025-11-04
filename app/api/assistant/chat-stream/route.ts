import { ChatMessage, generateStreamingResponse } from 'lib/ai/assistant';
import { areEmbeddingsInitialized } from 'lib/ai/embeddings';
import { saveChatMessage, saveMissingProduct, saveProductSearch } from 'lib/db/database';

export const dynamic = 'force-dynamic';

export interface ChatStreamRequest {
  message: string;
  history?: ChatMessage[];
  sessionId?: string;
}

/**
 * Streaming chat endpoint
 * POST /api/assistant/chat-stream
 */
export async function POST(request: Request) {
  try {
    // Check if embeddings are initialized
    if (!areEmbeddingsInitialized()) {
      return new Response(
        JSON.stringify({
          error: 'Assistant not initialized. Please wait while we load the product catalog.',
        }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const body: ChatStreamRequest = await request.json();

    if (!body.message || body.message.trim().length === 0) {
      return new Response(
        JSON.stringify({
          error: 'Message is required',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Generate session ID if not provided
    const sessionId = body.sessionId || `session-${Date.now()}`;

    // Save user message to database
    const userMessageId = saveChatMessage(sessionId, 'user', body.message);

    // Create a readable stream
    const encoder = new TextEncoder();
    let fullMessage = '';
    let products: any[] = [];
    let isProductSearch = false;

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Generate streaming response
          for await (const chunk of generateStreamingResponse(
            body.message,
            body.history || []
          )) {
            if (chunk.type === 'token' && chunk.content) {
              // Stream text token
              fullMessage += chunk.content;
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: 'token', content: chunk.content })}\n\n`)
              );
            } else if (chunk.type === 'products' && chunk.products) {
              // Send products
              isProductSearch = true;
              products = chunk.products.map(p => ({
                productId: p.productId,
                productHandle: p.productHandle,
                title: p.metadata.title,
                description: p.metadata.description,
                price: p.metadata.price,
                availableForSale: p.metadata.availableForSale,
                tags: p.metadata.tags,
              }));
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: 'products', products })}\n\n`)
              );
            } else if (chunk.type === 'done') {
              // Save assistant response to database
              saveChatMessage(sessionId, 'assistant', fullMessage);

              // Track product search
              if (products.length > 0) {
                const productIds = products.map(p => p.productId);
                saveProductSearch(sessionId, userMessageId, body.message, products.length, productIds);
              }

              // Track missing products
              if (products.length === 0 && isProductSearch) {
                saveMissingProduct(sessionId, userMessageId, body.message);
              }

              // Send session ID and done signal
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: 'done', sessionId })}\n\n`)
              );
              controller.close();
            }
          }
        } catch (error) {
          console.error('Error in streaming:', error);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: 'error', content: 'An error occurred. Please try again.' })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error in chat-stream endpoint:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Failed to process your message',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

