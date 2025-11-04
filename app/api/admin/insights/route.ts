import { NextResponse } from 'next/server';
import { getInsightsData, getInsightsSummary } from 'lib/db/insights';
import { generateAIInsights } from 'lib/ai/insights-generator';

export const dynamic = 'force-dynamic';

/**
 * Get AI-powered insights
 * GET /api/admin/insights?days=7
 */
export async function GET(request: Request): Promise<NextResponse> {
  try {
    // Simple auth check
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    // Get days parameter from query string
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7', 10);

    // Get raw data
    const data = getInsightsData(days);
    const summary = getInsightsSummary(days);

    // Generate AI insights
    const aiInsights = await generateAIInsights(
      data.userMessages,
      data.productSearches,
      data.missingProducts
    );

    return NextResponse.json({
      success: true,
      data: {
        summary,
        aiInsights,
      },
    });
  } catch (error) {
    console.error('Error in insights endpoint:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate insights',
      },
      { status: 500 }
    );
  }
}

