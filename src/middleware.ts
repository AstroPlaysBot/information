import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const userToken = req.cookies.get('user_token')?.value;
  const adminToken = req.cookies.get('admin_token')?.value;

  // =========================
  // PUBLIC ROUTES (WICHTIG!)
  // =========================
  if (
    pathname === '/' ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/api/discord-auth') ||
    pathname.startsWith('/api')
  ) {
    return NextResponse.next();
  }

  // =========================
  // DASHBOARD
  // =========================
  if (pathname.startsWith('/dashboard')) {
    if (!userToken && !adminToken) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.next();
  }

  // =========================
  // ADMINBOARD
  // =========================
  if (pathname.startsWith('/adminboard')) {
    if (!adminToken) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/adminboard/:path*',
    '/login/:path*',
    '/apply/:path*'
  ],
};
