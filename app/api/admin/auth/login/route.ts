import { NextResponse } from 'next/server';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await axios.post(API_ENDPOINTS.ADMIN_AUTH.LOGIN, body, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.status === 200) {
      const data = response.data;
      const is2FARequired = data.requires2FA || data.data?.requires2FA;

      if (is2FARequired) {
        return NextResponse.json({
          success: true,
          requires2FA: true,
          message: data.message || data.data?.message || 'Verification code sent',
          adminId: data.adminId || data.data?.adminId,
          email: data.email || data.data?.email,
        });
      }

      const token = data.token || data.data?.token || data.accessToken || data.data?.accessToken;

      if (!token) {
        console.error('Admin Login Error: No token found in response', data);
        return NextResponse.json({ error: 'Authentication failed: No token received' }, { status: 401 });
      }

      const userObj = data.admin || data.data?.admin || data.user || data.data?.user || data.data;
      const adminUser = { ...userObj, isAdmin: true };

      const nextResponse = NextResponse.json({
        success: true,
        user: adminUser,
        message: data.message || 'Admin login successful',
        requires2FA: data.requires2FA || data.data?.requires2FA,
      });

      // Only set cookie if no 2FA is required, or handle 2FA logic if needed
      if (!data.requires2FA && !data.data?.requires2FA) {
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

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Admin Login error:', error.response?.data || error.message);
      return NextResponse.json(
        { error: error.response?.data?.message || 'Authentication failed' },
        { status: error.response?.status || 500 }
      );
    }
    console.error('Admin Login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
