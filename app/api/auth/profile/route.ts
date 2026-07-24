import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import axios from 'axios';

export async function GET() {
  let token: string | undefined;
  try {
    const cookieStore = await cookies();
    token = cookieStore.get('auth-token')?.value;

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
  } catch (error: any) {
    if (error.response?.status === 401) {
      try {
        // Fallback: try fetching admin profile if user profile fails
        const adminResponse = await axios.get(API_ENDPOINTS.ADMIN_AUTH.ME, {
          headers: { 
            'Authorization': `Bearer ${token}` 
          },
        });
        
        if (adminResponse.status === 200) {
          const adminUser = adminResponse.data.user || adminResponse.data.data;
          return NextResponse.json({
            success: true,
            user: { ...adminUser, isAdmin: true },
          });
        }
      } catch (adminError: any) {
        console.error('Admin profile fallback error:', adminError.response?.data || adminError.message);
      }
      
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
