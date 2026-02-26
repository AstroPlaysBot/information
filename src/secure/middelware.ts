// src/secure/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getTokenCookie } from './session';

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // Nur Adminboard schützen
  if (url.pathname.startsWith('/adminboard')) {
    const token = req.cookies.get('personal_token')?.value;
    if (!token) return NextResponse.redirect('/login');

    // Serverseitig prüfen, ob Token Admin ist
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/adminboard`, {
      headers: { cookie: `personal_token=${token}` },
    });

    if (!res.ok) return NextResponse.redirect('/login');
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/adminboard/:path*'],
};
