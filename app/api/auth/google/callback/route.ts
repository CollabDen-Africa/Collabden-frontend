import { NextResponse } from 'next/server';
import { ROUTES } from '@/constants/routes';

/**
 * GET /api/auth/google/callback
 * This route is called after Google authentication.
 * It expects a 'token' query parameter from the backend.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  // Check common parameter names for the token (Backend might use token, accessToken, or wrap in data)
  const token = searchParams.get('token') || 
                searchParams.get('accessToken') || 
                searchParams.get('auth_token');

  console.log('Google Auth Callback: Initializing callback process');
  console.log('Available Search Params:', Array.from(searchParams.keys()));

  if (!token) {
    console.error('Google Auth Callback: No token provided in URL. Available params:', Array.from(searchParams.keys()));
    return NextResponse.redirect(new URL(`${ROUTES.AUTH.LOGIN}?error=${encodeURIComponent('Authentication failed: Missing token')}`, request.url));
  }

  // Create the response and redirect to dashboard
  const response = NextResponse.redirect(new URL(ROUTES.DASHBOARD.ROOT, request.url));

  // Set the HTTP-only cookie
  response.cookies.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });

  return response;
}
