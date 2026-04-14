import { NextResponse } from 'next/server';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await axios.post(API_ENDPOINTS.AUTH.SIGNUP, body, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.status === 201 || response.status === 200) {
      const data = response.data;
      
      // Audit Response Structure: Checking for token in root, .data, and common variants
      const token = data.token || data.data?.token || data.accessToken || data.data?.accessToken;

      const nextResponse = NextResponse.json({
        success: true,
        user: data.user || data.data?.user || data.data,
        message: data.message || 'Signup successful',
      });

      // Set the HTTP-only cookie ONLY if a token was returned
      // Some backends only return a token after email verification
      if (token) {
        nextResponse.cookies.set('auth-token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60, // 7 days
          path: '/',
        });
      }

      return nextResponse;
    }

    return NextResponse.json(
      { error: response.data?.message || 'Signup failed' }, 
      { status: response.status }
    );
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Signup error:', error.response?.data || error.message);
      return NextResponse.json(
        { error: error.response?.data?.message || error.response?.data?.error || 'Signup failed' },
        { status: error.response?.status || 500 }
      );
    }
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Signup failed' },
      { status: 500 }
    );
  }
}
