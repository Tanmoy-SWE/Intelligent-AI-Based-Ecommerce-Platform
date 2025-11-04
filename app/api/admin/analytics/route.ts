import { NextResponse } from 'next/server';
import { getAnalytics } from 'lib/db/database';

export const dynamic = 'force-dynamic';

/**
 * Get analytics data
 * GET /api/admin/analytics?days=7
 */
export async function GET(request: Request): Promise<NextResponse> {
  try {
    // Simple auth check (in production, use proper middleware)
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

    // Get analytics data
    const analytics = getAnalytics(days);

    return NextResponse.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error('Error in analytics endpoint:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch analytics',
      },
      { status: 500 }
    );
  }
}

