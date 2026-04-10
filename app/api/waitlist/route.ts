import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email: rawEmail, name } = await request.json();
    const email = rawEmail?.trim();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Basic server-side email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const sheetUrl = process.env.SHEET_BEST_URL;

    if (!sheetUrl) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const response = await fetch(sheetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([{
        timestamp: new Date().toISOString(),
        email,
        name: name || '',
      }]),
    });

    if (!response.ok) {
      throw new Error('Failed to save to sheet');
    }

    return NextResponse.json({ message: 'Success' }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
