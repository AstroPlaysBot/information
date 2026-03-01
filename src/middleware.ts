// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_USER_IDS } from './data/admins';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const userToken = req.cookies.get('user_token')?.value || '';
  const adminToken = req.cookies.get('admin_token')?.value || '';

  // Öffentlich
  if (pathname === '/' || pathname.startsWith('/api') || pathname.startsWith('/login')) {
    return NextResponse.next();
  }

  // Dashboard → User oder Admin
  if (pathname.startsWith('/dashboard')) {
    if (!userToken && !adminToken) return NextResponse.redirect('/login');
    return NextResponse.next();
  }

  // Adminboard → nur Admin
  if (pathname.startsWith('/adminboard')) {
    if (!adminToken) return NextResponse.redirect('/login');
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/adminboard/:path*', '/login', '/login/:path*'],
};
