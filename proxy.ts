import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ROUTES } from './constants/routes';

/**
 * Proxy (formerly Middleware) for Next.js 16
 * This handles request interception and routing at the edge.
 */
export function proxy(request: NextRequest) {
  
  // Dev bypass for localhost
  if (process.env.NODE_ENV === 'development') {
      return NextResponse.next();
  }
  const { pathname } = request.nextUrl;

  // Check if the route is a dashboard route
  if (pathname.startsWith(ROUTES.DASHBOARD.ROOT)) {
    // Check for session token cookie
    const token = request.cookies.get('auth-token');

    if (!token) {
      const loginUrl = new URL(ROUTES.AUTH.LOGIN, request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
