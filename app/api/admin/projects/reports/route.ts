import { NextResponse } from 'next/server';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import axios from 'axios';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No authentication token found' }, { status: 401 });
    }

    const response = await axios.get(API_ENDPOINTS.ADMIN_PROJECTS.REPORTS, {
      params: Object.fromEntries(searchParams.entries()),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Admin Project Reports Fetch Proxy Error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data?.error || 'Failed to fetch project reports' },
      { status: error.response?.status || 500 }
    );
  }
}
