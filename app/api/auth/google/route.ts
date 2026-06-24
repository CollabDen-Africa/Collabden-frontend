import { NextResponse } from 'next/server';
import { API_ENDPOINTS } from '@/constants/api-endpoints';

/**
 * GET /api/auth/google
 * This route redirects the user to the backend's Google authentication endpoint.
 */
export async function GET(request: Request) {
  try {
    const { origin, searchParams } = new URL(request.url);
    const mode = searchParams.get('mode') || 'login';
    
    // Construct the backend URL with origin information
    const backendUrl = new URL(API_ENDPOINTS.AUTH.GOOGLE_AUTH);
    
    // Try common parameter names for redirecting back to the frontend
    backendUrl.searchParams.set('frontend_url', origin);
    backendUrl.searchParams.set('redirect_uri', `${origin}/auth-callback`);
    
    console.log(`Google Auth Initiation (${mode}): Redirecting to`, backendUrl.toString());
    
    const response = NextResponse.redirect(backendUrl.toString());
    
    // Set a short-lived cookie to track flow mode (signup vs login)
    // This is more reliable than passing params to the backend if the backend doesn't return them
    response.cookies.set('auth_mode', mode, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 5 * 60, // 5 minutes is plenty for the OAuth handshake
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Google Auth redirect error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Google authentication' },
      { status: 500 }
    );
  }
}
