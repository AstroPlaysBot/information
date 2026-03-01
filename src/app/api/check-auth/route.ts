// src/app/api/check-auth/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  const admin = cookieStore.get('admin_token');
  const user = cookieStore.get('user_token');

  return NextResponse.json({
    authenticated: !!admin || !!user,
  });
}
