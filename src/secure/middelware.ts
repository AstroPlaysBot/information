// src/secure/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const path = url.pathname;

  const personalToken = req.cookies.get('personal_token')?.value;
  const userToken = req.cookies.get('user_token')?.value;

  // 🔹 Adminboard schützen
  if (path.startsWith('/adminboard')) {
    if (!personalToken) return NextResponse.redirect('/login');

    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/adminboard`, {
      headers: { cookie: `personal_token=${personalToken}` },
    });
    if (!res.ok) return NextResponse.redirect('/login');
  }

  // 🔹 Dashboard schützen (nur User mit Token)
  if (path.startsWith('/dashboard')) {
    if (!userToken && !personalToken) return NextResponse.redirect('/login');
  }

  // 🔹 Login-Seite nur sichtbar, wenn kein Token existiert
  if (path === '/login') {
    if (personalToken || userToken) return NextResponse.redirect('/dashboard');
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/adminboard/:path*', '/dashboard/:path*', '/login'],
};
