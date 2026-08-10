import { NextResponse } from 'next/server';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import axios from 'axios';
import { cookies } from 'next/headers';

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { projectId, reportId, status } = body;
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No authentication token found' }, { status: 401 });
    }

    const response = await axios.patch(
      API_ENDPOINTS.ADMIN_PROJECTS.UPDATE_REPORT_STATUS(projectId, reportId),
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Admin Project Report Update Proxy Error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data?.error || 'Failed to update report status' },
      { status: error.response?.status || 500 }
    );
  }
}
