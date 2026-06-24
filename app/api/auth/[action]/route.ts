import { NextRequest, NextResponse } from 'next/server';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import axios from 'axios';

/**
 * Consolidated dynamic Route Handler for authentication actions.
 * Intercepts calls to:
 * - /api/auth/verify
 * - /api/auth/resend-verify
 * - /api/auth/forgot-password
 * - /api/auth/reset-password
 *
 * Maps them dynamically to their respective backend services.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ action: string }> }
) {
  const { action } = await params;

  try {
    const body = await request.json();

    switch (action) {
      case 'verify': {
        const response = await axios.post(API_ENDPOINTS.AUTH.VERIFY, body, {
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.status === 200 || response.status === 201) {
          const data = response.data;
          const token = data.token || data.data?.token || data.accessToken || data.data?.accessToken;

          const nextResponse = NextResponse.json({
            success: true,
            user: data.user || data.data?.user || data.data,
            message: data.message || 'Verification successful',
          });

          // Write secure HTTP-only auth-token cookie upon success
          if (token) {
            nextResponse.cookies.set('auth-token', token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict',
              maxAge: 7 * 24 * 60 * 60, // 7 days
              path: '/',
            });
          }

          return nextResponse;
        }
        return NextResponse.json({ error: 'Verification failed' }, { status: 400 });
      }

      case 'resend-verify': {
        const response = await axios.post(API_ENDPOINTS.AUTH.RESEND_VERIFY, body, {
          headers: { 'Content-Type': 'application/json' },
        });
        return NextResponse.json(response.data, { status: response.status });
      }

      case 'forgot-password': {
        const response = await axios.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, body, {
          headers: { 'Content-Type': 'application/json' },
        });
        return NextResponse.json(response.data, { status: response.status });
      }

      case 'reset-password': {
        const response = await axios.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, body, {
          headers: { 'Content-Type': 'application/json' },
        });
        return NextResponse.json(response.data, { status: response.status });
      }

      default:
        return NextResponse.json({ error: `Auth action '${action}' not supported` }, { status: 404 });
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(`Auth proxy error for action [${action}]:`, error.response?.data || error.message);
      return NextResponse.json(
        { error: error.response?.data?.message || `Authentication action failed` },
        { status: error.response?.status || 500 }
      );
    }
    console.error(`Internal server error during auth action [${action}]:`, error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
