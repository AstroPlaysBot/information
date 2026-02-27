import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  if (
    req.nextUrl.pathname.startsWith('/login/dashboard') ||
    req.nextUrl.pathname.startsWith('/login/adminboard')
  ) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}
