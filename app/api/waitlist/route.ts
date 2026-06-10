import { NextResponse } from "next/server";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

export async function POST(request: Request) {
  try {
    const { email: rawEmail } = await request.json();
    const email = rawEmail?.trim();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Basic server-side email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const response = await fetch(API_ENDPOINTS.WAITLIST.JOIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || 'Failed to save to waitlist' },
        { status: response.status }
      );
    }

    return NextResponse.json(data || { message: 'Success' }, { status: 200 });
  } catch (error) {
    console.error('Waitlist proxy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
