import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  error?: string;
}

/**
 * Admin login endpoint
 * POST /api/admin/login
 */
export async function POST(request: Request): Promise<NextResponse<LoginResponse>> {
  try {
    const body: LoginRequest = await request.json();

    if (!body.username || !body.password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Username and password are required',
        },
        { status: 400 }
      );
    }

    // Simple authentication (in production, use proper auth)
    if (body.username === ADMIN_USERNAME && body.password === ADMIN_PASSWORD) {
      // Generate a simple token (in production, use JWT)
      const token = Buffer.from(`${ADMIN_USERNAME}:${ADMIN_PASSWORD}`).toString('base64');

      return NextResponse.json({
        success: true,
        token,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Invalid credentials',
      },
      { status: 401 }
    );
  } catch (error) {
    console.error('Error in login endpoint:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

