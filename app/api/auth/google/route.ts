import { NextResponse } from 'next/server';
import { API_ENDPOINTS } from '@/constants/api-endpoints';

/**
 * GET /api/auth/google
 * This route redirects the user to the backend's Google authentication endpoint.
 */
export async function GET() {
  try {
    return NextResponse.redirect(API_ENDPOINTS.AUTH.GOOGLE_AUTH);
  } catch (error) {
    console.error('Google Auth redirect error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Google authentication' },
      { status: 500 }
    );
  }
}
