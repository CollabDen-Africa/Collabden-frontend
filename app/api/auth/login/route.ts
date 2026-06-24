import { NextResponse } from 'next/server';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, body, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.status === 200) {
      const data = response.data;
      
      // Audit Response Structure: Checking for token in root, .data, and common variants
      const token = data.token || data.data?.token || data.accessToken || data.data?.accessToken;

      if (!token) {
        console.error('Login Error: No token found in response', data);
        return NextResponse.json({ error: 'Authentication failed: No token received' }, { status: 401 });
      }

      // Create the response with standardized user extraction
      const nextResponse = NextResponse.json({
        success: true,
        user: data.user || data.data?.user || data.data,
        message: data.message || 'Login successful',
      });

      // Set the HTTP-only cookie
      nextResponse.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
      });

      return nextResponse;
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Login error:', error.response?.data || error.message);
      return NextResponse.json(
        { error: error.response?.data?.message || 'Authentication failed' },
        { status: error.response?.status || 500 }
      );
    }
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
