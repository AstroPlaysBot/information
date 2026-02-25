// middleware/adminAuth.ts
import { NextResponse } from 'next/server';

export async function adminAuth(req: Request) {
  const cookieHeader = req.headers.get('cookie') ?? '';
  const match = cookieHeader.match(/discord_token=([^;]+)/);
  const token = match?.[1];

  if (!token) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/admin-check`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const data = await res.json();
    if (!data.allowed) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return null; // ✅ Zugriff erlaubt
  } catch (err) {
    console.error('ADMIN AUTH ERROR', err);
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}
