// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const userToken = req.cookies.get('user_token')?.value;
  const adminToken = req.cookies.get('admin_token')?.value;

  // Öffentlich zugänglich
  if (pathname === '/' || pathname.startsWith('/api') || pathname.startsWith('/login')) {
    return NextResponse.next();
  }

  // Dashboard → jeder eingeloggte User (User oder Admin)
  if (pathname.startsWith('/dashboard')) {
    if (!userToken && !adminToken) {
      return NextResponse.redirect('/api/discord-auth');
    }
    return NextResponse.next();
  }

  // Adminboard → nur Admin
  if (pathname.startsWith('/adminboard')) {
    if (!adminToken) {
      return NextResponse.redirect('/api/discord-auth');
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Middleware wird nur auf relevante Pfade angewendet
export const config = {
  matcher: ['/dashboard/:path*', '/adminboard/:path*', '/login', '/login/:path*'],
};
