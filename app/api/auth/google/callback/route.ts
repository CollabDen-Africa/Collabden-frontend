import { NextResponse } from 'next/server';

/**
 * GET /api/auth/google/callback
 * This route is called after Google authentication.
 * It expects a 'token' query parameter from the backend.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  console.log('Google Auth Proxy Callback: Redirecting to unified /auth-callback');

  // Forward all parameters to the unified handler
  const unifiedCallbackUrl = new URL('/auth-callback', origin);
  searchParams.forEach((value, key) => {
    unifiedCallbackUrl.searchParams.set(key, value);
  });

  return NextResponse.redirect(unifiedCallbackUrl.toString());
}
