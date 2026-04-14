import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import axios from 'axios';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const response = await axios.get(API_ENDPOINTS.AUTH.PROFILE, {
      headers: { 
        'Authorization': `Bearer ${token}` 
      },
    });

    if (response.status === 200) {
      return NextResponse.json({
        success: true,
        user: response.data.user || response.data.data,
      });
    }

    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: response.status });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Profile fetch error:', error.response?.data || error.message);
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
