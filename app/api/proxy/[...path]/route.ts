import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_BASE_URL } from '@/constants/api-endpoints';

/**
 * Catch-all API proxy route.
 * Reads the auth-token from the HTTP-only cookie and forwards it as a Bearer token
 * to the backend. This allows client-side code to call `/api/proxy/dashboard`
 * instead of managing tokens directly.
 *
 * Maps: /api/proxy/{path} → ${API_BASE_URL}/api/v1/{path}
 */

async function handleRequest(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const backendPath = path.join('/');
  const backendUrl = new URL(`/api/v1/${backendPath}`, API_BASE_URL);

  // Forward any query params
  const { searchParams } = new URL(request.url);
  searchParams.forEach((value, key) => {
    backendUrl.searchParams.set(key, value);
  });

  const headers: Record<string, string> = {
    'Authorization': `Bearer ${token}`,
  };

  // Preserve the incoming Content-Type header (especially for multipart/form-data boundary parameters)
  const incomingContentType = request.headers.get('content-type');
  if (incomingContentType) {
    headers['Content-Type'] = incomingContentType;
  }

  try {
    const fetchOptions: RequestInit & { duplex?: string } = {
      method: request.method,
      headers,
      cache: 'no-store',
    };

    // Forward the request body for non-GET/HEAD methods
    if (!['GET', 'HEAD'].includes(request.method)) {
      if (incomingContentType?.includes('multipart/form-data')) {
        // Stream the body stream directly to keep multipart boundary parameters intact
        fetchOptions.body = request.body || undefined;
        fetchOptions.duplex = 'half';
      } else {
        const body = await request.text();
        if (body) {
          fetchOptions.body = body;
        }
      }
    }

    const response = await fetch(backendUrl.toString(), fetchOptions);

    const responseContentType = response.headers.get('content-type') || 'application/json';
    const responseHeaders: Record<string, string> = {
      'Content-Type': responseContentType,
    };

    if (responseContentType.includes('application/json')) {
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        return NextResponse.json(
          data || { error: `Backend error: ${response.statusText}` },
          { status: response.status }
        );
      }

      return NextResponse.json(data, { status: response.status });
    } else {
      // Non-JSON response (e.g. static files, binary PDFs, streams)
      if (!response.ok) {
        return new NextResponse(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: responseHeaders,
        });
      }

      return new NextResponse(response.body, {
        status: response.status,
        headers: responseHeaders,
      });
    }
  } catch (error) {
    console.error(`Proxy error [${request.method} /api/v1/${backendPath}]:`, error);
    return NextResponse.json(
      { error: 'Failed to reach backend' },
      { status: 502 }
    );
  }
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PATCH = handleRequest;
export const PUT = handleRequest;
export const DELETE = handleRequest;
