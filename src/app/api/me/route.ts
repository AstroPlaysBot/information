// app/api/me/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const token = cookies().get('discord_token')?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const userRes = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!userRes.ok) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const user = await userRes.json();

  const created_at = new Date(
    Number((BigInt(user.id) >> 22n) + 1420070400000n)
  ).toISOString();

  return NextResponse.json({
    authenticated: true,
    user: {
      id: user.id,
      username: user.username,
      discriminator: user.discriminator,
      avatar: user.avatar,
      created_at,
    },
  });
}
