import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ROUTES } from './constants/routes';

/**
 * Middleware for Next.js 15+
 * This handles request interception and routing at the edge.
 */
export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected route prefixes
  const protectedRoutes = [
    ROUTES.DASHBOARD.ROOT,
    ROUTES.PROJECTS.LIST,
    '/projects', // Catch-all for projects subroutes
    '/workspace', // Protected workspace
    '/intro',     // Protected onboarding intro
  ];

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    // Check for session token cookie
    const token = request.cookies.get('auth-token');

    if (!token) {
      const loginUrl = new URL(ROUTES.AUTH.LOGIN, request.url);
      // Preserve the intended destination in redirect
      loginUrl.searchParams.set('callbackUrl', pathname);
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
