// src/app/api/me/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const token = cookies().get('user_token')?.value;

  if (!token) {
    // kein Cookie → nicht eingeloggt
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const res = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const user = await res.json();

    return NextResponse.json({ user });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
