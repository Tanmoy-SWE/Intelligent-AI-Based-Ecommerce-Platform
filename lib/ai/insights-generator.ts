import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AIInsights {
  hotProducts: string[];
  trendingCategories: string[];
  customerIntent: string[];
  recommendations: string[];
  summary: string;
}

/**
 * Generate AI-powered insights from user queries using LLM
 */
export async function generateAIInsights(
  userMessages: Array<{ content: string; created_at: string }>,
  productSearches: Array<{
    search_query: string;
    products_found: number;
    top_products: string | null;
    created_at: string;
  }>,
  missingProducts: Array<{ search_query: string; created_at: string }>
): Promise<AIInsights> {
  // Prepare data summary for the LLM
  const userQueriesSummary = userMessages.map((m) => m.content).join('\n- ');
  const searchesSummary = productSearches
    .map((s) => `"${s.search_query}" (${s.products_found} products found)`)
    .join('\n- ');
  const missingSummary = missingProducts.map((m) => `"${m.search_query}"`).join('\n- ');

  const prompt = `You are an e-commerce analytics expert. Analyze the following user queries and search data from our shopping assistant chatbot to generate actionable insights.

**User Queries (${userMessages.length} total):**
- ${userQueriesSummary || 'No queries yet'}

**Product Searches (${productSearches.length} total):**
- ${searchesSummary || 'No searches yet'}

**Missing Product Requests (${missingProducts.length} total):**
- ${missingSummary || 'No missing product requests'}

Based on this data, provide insights in the following JSON format:

{
  "hotProducts": ["product1", "product2", "product3"],
  "trendingCategories": ["category1", "category2", "category3"],
  "customerIntent": ["intent1", "intent2", "intent3"],
  "recommendations": ["recommendation1", "recommendation2", "recommendation3"],
  "summary": "A brief 2-3 sentence summary of key findings"
}

**Guidelines:**
- **hotProducts**: List 3-5 most frequently mentioned or searched products (e.g., "T-Shirts", "Hoodies", "Football Boots")
- **trendingCategories**: Identify 3-5 product categories users are interested in (e.g., "Sportswear", "Winter Clothing", "Accessories")
- **customerIntent**: Describe 3-5 common user intentions or needs (e.g., "Looking for winter clothing", "Searching for sports equipment", "Interested in casual wear")
- **recommendations**: Provide 3-5 actionable business recommendations (e.g., "Stock more football boots", "Add winter jacket collection", "Promote t-shirt deals")
- **summary**: A concise overview of the most important findings

**Important:**
- If there's no data, provide empty arrays and a message saying "Not enough data yet"
- Be specific and data-driven
- Focus on actionable insights
- Use the actual product names and categories from the queries

Return ONLY valid JSON, no additional text.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert e-commerce data analyst. Analyze user queries and provide actionable insights in JSON format.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3, // Lower temperature for more consistent analysis
      max_tokens: 1000,
      response_format: { type: 'json_object' },
    });

    const responseText = completion.choices[0]?.message.content || '{}';
    const insights: AIInsights = JSON.parse(responseText);

    return insights;
  } catch (error) {
    console.error('Error generating AI insights:', error);

    // Return default insights on error
    return {
      hotProducts: [],
      trendingCategories: [],
      customerIntent: [],
      recommendations: [],
      summary: 'Unable to generate insights at this time. Please try again later.',
    };
  }
}

