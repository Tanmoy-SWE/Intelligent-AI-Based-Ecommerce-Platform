import OpenAI from 'openai';
import { ProductEmbedding, searchProducts } from './embeddings';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AssistantResponse {
  message: string;
  products: ProductEmbedding[];
  isProductSearch: boolean;
}

const SYSTEM_PROMPT = `You are a knowledgeable and friendly e-commerce shopping assistant for Next.js Commerce store. Your expertise includes:

**Core Responsibilities:**
1. **Product Q&A** - Answer detailed questions about specific products (materials, sizes, features, suitability)
2. **Smart Recommendations** - Suggest products based on customer needs, preferences, and use cases
3. **Product Comparisons** - Help customers understand differences between similar products
4. **Style Advice** - Provide outfit suggestions and product pairings

**Response Guidelines:**

For **Product Questions** (e.g., "Tell me about the black t-shirt"):
- Provide specific details: material, sizes, price, key features
- Mention what makes it special or suitable for certain uses
- Be informative but concise
- Example: "The **Essential Black T-Shirt** is made from 100% cotton, available in sizes S-XL, and costs **$29**. It's part of our basics collection and great for everyday wear! 👕"

For **Recommendations** (e.g., "I need something warm for winter"):
- Suggest 2-3 most relevant products from the search results
- Explain WHY each product fits their needs
- Highlight key differences between options (price, style, features)
- Help them choose based on use case (formal vs casual, budget, activity)
- Example: "Based on our winter collection, I'd recommend the **Wool Coat** (**$199**) or the **Down Jacket** (**$149**). The wool coat is more formal and elegant 🧥, while the down jacket is better for casual outdoor activities and provides excellent insulation! ❄️"

For **Comparisons** (e.g., "What's the difference between these sneakers?"):
- Create clear side-by-side comparisons
- Focus on: materials, price, style, intended use, key features
- Help them decide which is better for their specific needs
- Example: "The **Classic Sneakers** (**$79**) are canvas with a casual style perfect for everyday wear 👟, while the **Performance Sneakers** (**$129**) have better cushioning and arch support, designed specifically for athletic activities! 🏃"

For **Style/Pairing Questions** (e.g., "What goes well with dark jeans?"):
- Suggest complementary products from the catalog
- Explain the style reasoning
- Consider occasion and season

**Tone & Style:**
- Friendly and conversational, like a knowledgeable store associate 😊
- Confident but not pushy
- Use natural language, avoid robotic responses
- Be enthusiastic about products without overselling
- Use emojis occasionally (1-2 per response) to add warmth and personality ✨
- If unsure or no products match, be honest and suggest alternatives

**Formatting Rules:**
- **ALWAYS** use **bold** for product names (e.g., **Acme T-Shirt**)
- **ALWAYS** use **bold** for prices (e.g., **$25.00**)
- Use emojis sparingly but effectively (1-2 per response max)
- Keep responses natural and conversational

**CRITICAL RULES - NEVER VIOLATE:**
1. **ONLY recommend products from the "AVAILABLE PRODUCTS" list provided to you**
2. **NEVER make up, invent, or hallucinate product names, prices, or details**
3. **NEVER mention products that are not in the provided list**
4. If no products are provided or none match, say so honestly - don't invent alternatives
5. Always use the EXACT product names and prices from the list
6. Product cards will be displayed automatically, so focus on helpful context

**Important:**
- Always mention product names and prices when discussing specific items
- The products shown to you are the most relevant matches from our catalog
- If multiple products are relevant, explain the key differences to help customers choose
- Keep responses concise (2-4 sentences for simple questions, up to 6-8 sentences for recommendations)

Remember: You're here to help customers make informed decisions and find exactly what they need! 🛍️`;

/**
 * Use LLM to determine if the user query is asking for product recommendations/search
 */
async function isProductSearchQuery(message: string): Promise<boolean> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an intent classifier for an e-commerce chatbot. Determine if the user wants to see/search for products.

Return "true" if the user is:
- Asking for product recommendations
- Searching for specific items
- Browsing products
- Asking "do you have X"
- Requesting to see products
- Shopping for something

Return "false" if the user is:
- Just greeting (hi, hello, how are you)
- Asking general questions about the store
- Saying thank you
- Having casual conversation
- Asking about policies, shipping, returns

Respond with ONLY "true" or "false" - nothing else.`
        },
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.1,
      max_tokens: 10
    });

    const result = response.choices[0]?.message?.content?.trim().toLowerCase();
    return result === 'true';
  } catch (error) {
    console.error('Error detecting intent:', error);
    // Fallback to simple keyword detection if LLM fails
    const lowerMessage = message.toLowerCase();
    return lowerMessage.includes('show') ||
           lowerMessage.includes('find') ||
           lowerMessage.includes('have') ||
           lowerMessage.includes('need') ||
           lowerMessage.includes('want') ||
           lowerMessage.includes('buy');
  }
}

/**
 * Generate a response using the LLM with product context
 */
/**
 * Expand semantic queries to include related terms
 * E.g., "winter collection" → "winter warm hoodie fleece cold weather"
 */
function expandSemanticQuery(query: string): string {
  const lowerQuery = query.toLowerCase();
  let expandedQuery = query;

  // Winter-related expansion
  if (lowerQuery.includes('winter') || lowerQuery.includes('cold')) {
    expandedQuery += ' warm hoodie fleece jacket beanie cold weather';
  }

  // Summer-related expansion
  if (lowerQuery.includes('summer') || lowerQuery.includes('hot')) {
    expandedQuery += ' lightweight breathable t-shirt tank top';
  }

  // Fall/Autumn expansion
  if (lowerQuery.includes('fall') || lowerQuery.includes('autumn')) {
    expandedQuery += ' hoodie jacket layering';
  }

  // Spring expansion
  if (lowerQuery.includes('spring')) {
    expandedQuery += ' lightweight jacket hoodie';
  }

  // Collection/catalog queries
  if (lowerQuery.includes('collection') || lowerQuery.includes('catalog') || lowerQuery.includes('products')) {
    expandedQuery += ' clothing accessories apparel';
  }

  return expandedQuery;
}

export async function generateAssistantResponse(
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): Promise<AssistantResponse> {
  try {
    // Determine if this is a product search query using LLM
    const shouldShowProducts = await isProductSearchQuery(userMessage);
    console.log('🔍 Product Search Detection:', { userMessage, shouldShowProducts });

    // Expand query with semantic terms for better matching
    const expandedQuery = expandSemanticQuery(userMessage);
    console.log('🔍 Query Expansion:', { original: userMessage, expanded: expandedQuery });

    // Search for relevant products with similarity threshold
    // minSimilarity: 0.3 means only return products with 30%+ similarity
    // Lower threshold allows more flexible matching for general queries
    const searchResults = await searchProducts(expandedQuery, 5, 0.3);
    console.log('🔍 Search Results:', { count: searchResults.length, results: searchResults.map(r => ({ title: r.metadata.title, similarity: r.similarity })) });

    // Only return products if user is actively searching for them
    const relevantProducts = shouldShowProducts ? searchResults : [];
    console.log('🔍 Relevant Products to Return:', { count: relevantProducts.length });

    // Build product context with detailed information
    let productContext = '';

    if (shouldShowProducts && relevantProducts.length > 0) {
      // User is looking for products - show them
      productContext = `\n\n**AVAILABLE PRODUCTS (Most Relevant First):**\n${relevantProducts
        .map(
          (p, idx) => `
${idx + 1}. **${p.metadata.title}** - ${p.metadata.price}
   📝 Description: ${p.metadata.description}
   💰 Price: ${p.metadata.price}
   ✅ In Stock: ${p.metadata.availableForSale ? 'Yes' : 'No (Out of Stock)'}
   🏷️ Categories: ${p.metadata.tags.join(', ')}
   🔗 Handle: ${p.productHandle}
`
        )
        .join('\n')}
---
**STRICT INSTRUCTIONS:**
- ONLY recommend products from the list above
- Use EXACT product names and prices as shown
- DO NOT invent or mention any other products
- Explain why these specific products match the user's needs
- Product cards will be shown automatically`;
    } else if (shouldShowProducts && relevantProducts.length === 0) {
      // User wants products but none found
      productContext = '\n\n**NO PRODUCTS FOUND**\n**CRITICAL:** No products match this query. You MUST tell the user we don\'t have matching products. Politely suggest they try different keywords, browse our full catalog at /products, or ask about available categories. DO NOT make up or suggest products that don\'t exist.';
    } else {
      // User is just chatting - don't show products
      productContext = '\n\n**CASUAL CONVERSATION**\nThe user is not looking for products right now. Just have a friendly conversation. Do not mention or recommend any products unless they specifically ask for them.';
    }

    // Build messages for the API
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: SYSTEM_PROMPT + productContext,
      },
      ...conversationHistory.map(msg => ({
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content,
      })),
      {
        role: 'user',
        content: userMessage,
      },
    ];

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 800, // Increased for more detailed responses
    });

    const assistantMessage = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.';

    return {
      message: assistantMessage,
      products: relevantProducts,
      isProductSearch: shouldShowProducts,
    };
  } catch (error) {
    console.error('Error generating assistant response:', error);
    throw new Error('Failed to generate response. Please try again.');
  }
}

/**
 * Generate a streaming response with real-time token streaming
 */
export async function* generateStreamingResponse(
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): AsyncGenerator<{ type: 'token' | 'products' | 'done'; content?: string; products?: ProductEmbedding[] }> {
  try {
    // Detect intent and search for products
    const shouldShowProducts = await isProductSearchQuery(userMessage);
    const expandedQuery = expandSemanticQuery(userMessage);

    console.log('🔍 Streaming - Product Search Detection:', { userMessage, shouldShowProducts });
    console.log('🔍 Streaming - Query Expansion:', { original: userMessage, expanded: expandedQuery });

    const searchResults = await searchProducts(expandedQuery, 5, 0.3);
    const relevantProducts = searchResults;

    console.log('🔍 Streaming - Search Results:', { count: searchResults.length, results: searchResults.map(p => ({ title: p.metadata.title, similarity: p.similarity })) });
    console.log('🔍 Streaming - Relevant Products to Return:', { count: relevantProducts.length });

    let productContext = '';

    if (shouldShowProducts && relevantProducts.length > 0) {
      productContext = `\n\n**AVAILABLE PRODUCTS (Most Relevant First):**\n${relevantProducts
          .map(
            (p, idx) => `
${idx + 1}. **${p.metadata.title}** - ${p.metadata.price}
   📝 Description: ${p.metadata.description}
   💰 Price: ${p.metadata.price}
   ✅ In Stock: ${p.metadata.availableForSale ? 'Yes' : 'No (Out of Stock)'}
   🏷️ Categories: ${p.metadata.tags.join(', ')}
   🔗 Handle: ${p.productHandle}
`
          )
          .join('\n')}
---
**STRICT INSTRUCTIONS:**
- ONLY recommend products from the list above
- Use EXACT product names and prices as shown
- DO NOT invent or mention any other products
- Explain why these specific products match the user's needs
- Product cards will be shown automatically`;
    } else if (shouldShowProducts && relevantProducts.length === 0) {
      productContext = '\n\n**NO PRODUCTS FOUND**\n**CRITICAL:** No products match this query. You MUST tell the user we don\'t have matching products. Politely suggest they try different keywords, browse our full catalog at /products, or ask about available categories. DO NOT make up or suggest products that don\'t exist.';
    } else {
      productContext = '\n\n**CASUAL CONVERSATION**\nThe user is not looking for products right now. Just have a friendly conversation. Do not mention or recommend any products unless they specifically ask for them.';
    }

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: SYSTEM_PROMPT + productContext,
      },
      ...conversationHistory.map(msg => ({
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content,
      })),
      {
        role: 'user',
        content: userMessage,
      },
    ];

    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 800,
      stream: true,
    });

    // Stream tokens
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        yield { type: 'token', content };
      }
    }

    // Send products after streaming is done
    if (relevantProducts.length > 0) {
      yield { type: 'products', products: relevantProducts };
    }

    // Signal completion
    yield { type: 'done' };
  } catch (error) {
    console.error('Error generating streaming response:', error);
    yield { type: 'token', content: 'I apologize, but I encountered an error. Please try again.' };
    yield { type: 'done' };
  }
}

