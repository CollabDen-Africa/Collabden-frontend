import { NextResponse } from 'next/server';
import { ROUTES } from '@/constants/routes';

/**
 * Handle Google OAuth callback from backend as a Route Handler
 * Expected URL: /auth-callback?token=...
 * This is used because cookies can only be modified in a Server Action or Route Handler.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  console.log('AuthCallback (Route Handler): Initializing callback process');

  if (!token) {
    console.error('AuthCallback: No token provided in URL');
    return NextResponse.redirect(new URL(ROUTES.AUTH.LOGIN, request.url));
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

  console.log('AuthCallback: Token set via Route Handler, redirecting to dashboard');
  
  return response;
}
