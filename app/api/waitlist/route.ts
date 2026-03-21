import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();

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
      console.error("SHEET_BEST_URL is not defined in environment variables");
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
      const errorText = await response.text();
      console.error("SheetBest Error:", errorText);
      throw new Error('Failed to save to sheet');
    }

    return NextResponse.json({ message: 'Success' }, { status: 200 });
  } catch (error) {
    console.error("Waitlist API Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
