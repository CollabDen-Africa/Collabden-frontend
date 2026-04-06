import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ROUTES } from './constants/routes';

export function middleware(request: NextRequest) {
  
  //Dev bypass for localhost
  if (process.env.NODE_ENV === 'development') {
      return NextResponse.next();
  }
  
  const { pathname } = request.nextUrl;

  // Check if the route is a dashboard route
  if (pathname.startsWith(ROUTES.DASHBOARD.ROOT)) {
    // Basic placeholder for auth check
    // In a real app, you would check for a session or token cookie
    const token = request.cookies.get('auth-token');

    if (!token) {
      const loginUrl = new URL(ROUTES.AUTH.LOGIN, request.url);
      // Optional: Add a redirect parameter to return to the original page after login
      // loginUrl.searchParams.set('from', pathname);
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
