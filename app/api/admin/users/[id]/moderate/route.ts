import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';
import { API_ENDPOINTS } from '@/constants/api-endpoints';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const response = await axios.post(
      `${API_ENDPOINTS.ADMIN_AUTH.ALL_USERS}/${id}/moderate`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error(`Admin User Moderate Proxy Error (ID: ${error.response?.data || error.message}):`, error);
    return NextResponse.json(
      { error: error.response?.data?.error || 'Failed to moderate user' },
      { status: error.response?.status || 500 }
    );
  }
}
