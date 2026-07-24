import { NextResponse } from 'next/server';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await axios.post(API_ENDPOINTS.ADMIN_AUTH.VERIFY_2FA, body, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.status === 200) {
      const data = response.data;
      
      const token = data.token || data.data?.token || data.accessToken || data.data?.accessToken;

      if (!token) {
        return NextResponse.json({ error: 'Authentication failed: No token received' }, { status: 401 });
      }

      const userObj = data.admin || data.data?.admin || data.user || data.data?.user || data.data;
      const adminUser = { ...userObj, isAdmin: true };

      const nextResponse = NextResponse.json({
        success: true,
        user: adminUser,
        message: data.message || 'Verification successful',
      });

      nextResponse.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      });

      return nextResponse;
    }

    return NextResponse.json({ error: 'Invalid verification code' }, { status: 401 });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.message || 'Verification failed' },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}
