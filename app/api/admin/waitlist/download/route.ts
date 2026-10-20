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

    const response = await axios.get(API_ENDPOINTS.WAITLIST.DOWNLOAD, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'arraybuffer',
    });

    return new NextResponse(response.data, {
      status: 200,
      headers: {
        'Content-Type': String(response.headers['content-type'] || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
        'Content-Disposition': response.headers['content-disposition'] || 'attachment; filename="waitlist.xlsx"',
      },
    });
  } catch (error: any) {
    console.error('Admin Waitlist Download Error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data?.error || 'Failed to download waitlist' },
      { status: error.response?.status || 500 }
    );
  }
}
