// src/app/api/check-session/route.ts
import { NextResponse } from 'next/server';
import { getTokenCookie } from '@/secure/session';

export async function GET() {
  const adminToken = getTokenCookie('personal_token');
  const userToken = getTokenCookie('user_token');

  return NextResponse.json({
    isAdmin: !!adminToken,
    isUser: !!userToken || !!adminToken,
  });
}
