import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const response = await fetch(process.env.SHEET_BEST_URL!, {
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
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
