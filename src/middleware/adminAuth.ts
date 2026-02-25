// middleware/adminAuth.ts
import { NextResponse } from 'next/server';

export async function adminAuth(req: Request) {
  // 🔹 1️⃣ Token aus Cookies lesen
  const cookieHeader = req.headers.get('cookie') || '';
  const tokenMatch = cookieHeader.match(/discord_token=([^;]+)/);
  const token = tokenMatch ? tokenMatch[1] : undefined;

  if (!token) {
    return NextResponse.json({ error: 'Forbidden: Kein Token' }, { status: 403 });
  }

  try {
    // 🔹 2️⃣ Admin-Check aufrufen
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/admin-check`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const data = await res.json();
    if (!data.allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    // 🔹 3️⃣ Admin-Check erfolgreich → Anfrage weiterleiten
    return null; // null bedeutet: Middleware lässt den Request passieren
  } catch (err) {
    console.error('ADMIN AUTH ERROR', err);
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}
