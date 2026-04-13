// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const userToken = req.cookies.get('user_token')?.value;
  const adminToken = req.cookies.get('admin_token')?.value;

  // ❌ NICHT API komplett bypassen (nur Auth-Route erlauben!)
  if (
    pathname === '/' ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/api/discord-auth')
  ) {
    return NextResponse.next();
  }

  // Dashboard → jeder eingeloggte User (User oder Admin)
  if (pathname.startsWith('/dashboard')) {
    if (!userToken && !adminToken) {
      return NextResponse.redirect(new URL('/api/discord-auth', req.url));
    }
    return NextResponse.next();
  }

  // Adminboard → nur Admin
  if (pathname.startsWith('/adminboard')) {
    if (!adminToken) {
      return NextResponse.redirect(new URL('/api/discord-auth', req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Middleware wird nur auf relevante Pfade angewendet
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/adminboard/:path*',
    '/login/:path*'
  ],
};
