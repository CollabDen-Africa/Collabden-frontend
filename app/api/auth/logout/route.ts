import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * Handle user logout by clearing the auth-token cookie.
 */
export async function POST() {
  const cookieStore = await cookies();
  
  // Clear the auth-token cookie
  cookieStore.delete('auth-token');

  return NextResponse.json({ 
    success: true, 
    message: 'Logged out successfully' 
  });
}
