// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_USER_IDS } from './data/admins';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const discordId = req.cookies.get('discord_id')?.value;

  // Öffentlich zugänglich
  if (pathname === '/' || pathname.startsWith('/api') || pathname.startsWith('/login')) {
    return NextResponse.next();
  }

  // Dashboard → nur normaler User oder Admin
  if (pathname.startsWith('/dashboard')) {
    if (!discordId) return NextResponse.redirect('/login');
    return NextResponse.next();
  }

  // Adminboard → nur Admins
  if (pathname.startsWith('/adminboard')) {
    if (!discordId || !ADMIN_USER_IDS.includes(discordId)) return NextResponse.redirect('/login');
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Apply middleware nur auf bestimmte Pfade
export const config = {
  matcher: ['/dashboard/:path*', '/adminboard/:path*', '/login/:path*'],
};
