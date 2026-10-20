import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import axios from 'axios';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No authentication token found' }, { status: 401 });
    }

    const response = await axios.get(API_ENDPOINTS.WAITLIST.LIST, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    const status = error.response?.status;
    const backendError = error.response?.data;
    console.error(`[admin/waitlist] Backend returned ${status}:`, backendError || error.message);
    console.error(`[admin/waitlist] Attempted URL: ${API_ENDPOINTS.WAITLIST.LIST}`);
    return NextResponse.json(
      { error: backendError?.message || backendError?.error || 'Failed to fetch waitlist entries', backendStatus: status },
      { status: status || 500 }
    );
  }
}
