import { NextResponse } from 'next/server';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await axios.post(API_ENDPOINTS.ADMIN_AUTH.RESEND_2FA, body, {
      headers: { 'Content-Type': 'application/json' },
    });

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.message || 'Failed to resend code' },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to resend code' },
      { status: 500 }
    );
  }
}
