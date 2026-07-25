import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ROUTES } from './constants/routes';

/**
 * Middleware for Next.js 15+
 * This handles request interception and routing at the edge.
 */
export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // DEV BYPASS: If running locally, let every request pass through
  if (process.env.NODE_ENV === "development") {
    return NextResponse.next();
  }

  // Protected route prefixes
  const protectedRoutes = [
    ROUTES.DASHBOARD.ROOT,
    ROUTES.PROJECTS.LIST,
    "/projects", // Catch-all for projects subroutes
    "/workspace", // Protected workspace
    "/intro", // Protected onboarding intro
  ];

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // Check for session token cookie
    const token = request.cookies.get("auth-token");

    if (!token) {
      const loginUrl = new URL(ROUTES.AUTH.LOGIN, request.url);
      // Preserve the intended destination in redirect
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Admin routes protection (exclude public admin auth pages)
  const publicAdminRoutes = [
    "/admin",
    "/admin/verify",
    "/admin/forgot-password",
    "/admin/reset-link-sent",
    "/admin/account-locked",
    "/admin/reset-password",
  ];
  const isPublicAdminRoute = publicAdminRoutes.includes(pathname);

  if (pathname.startsWith("/admin") && !isPublicAdminRoute) {
    const token = request.cookies.get("auth-token");
    if (!token) {
      const loginUrl = new URL(ROUTES.ADMIN.LOGIN, request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
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
