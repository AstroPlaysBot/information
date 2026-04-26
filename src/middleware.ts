import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const OWNER_ID = "1462891063202156807";
const DISCORD_USER_URL = "https://discord.com/api/users/@me";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const userToken = req.cookies.get('user_token')?.value;
  const adminToken = req.cookies.get('admin_token')?.value;

  // Öffentlich zugänglich
  if (pathname === '/' || pathname.startsWith('/api') || pathname.startsWith('/login')) {
    return NextResponse.next();
  }

  // ── Wartungscheck ──────────────────────────────────────────
  try {
    const res = await fetch(`${req.nextUrl.origin}/api/adminboard/maintenance`);
    const { pages } = await res.json();
    const match = pages?.find((p: { path: string }) => p.path === pathname);
    if (match) {
      // Owner durchlassen
      if (adminToken) {
        const discordRes = await fetch(DISCORD_USER_URL, {
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        const discordUser = await discordRes.json();
        if (discordUser?.id === OWNER_ID) return NextResponse.next();
      }
      // alle anderen → Wartungsseite
      const url = req.nextUrl.clone();
      url.pathname = '/maintenance';
      url.searchParams.set('reason', match.reason);
      return NextResponse.rewrite(url);
    }
  } catch {}
  // ──────────────────────────────────────────────────────────

  // Dashboard → jeder eingeloggte User
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

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/adminboard/:path*',
    '/purchase/:path*',
    '/apply/:path*',
    '/team/:path*',
    '/login/:path*',
    '/world-league/leaderboard/:path*',
    '/world-league/rules/:path*'
  ],
};
