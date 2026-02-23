// app/api/discord-auth/route.ts
import { NextResponse } from 'next/server';

const CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;
const REDIRECT_URI = `${APP_URL}/dashboard`;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const state = searchParams.get('state') ?? 'dashboard';

  const url =
    `https://discord.com/api/oauth2/authorize` +
    `?client_id=${CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&response_type=code` +
    `&scope=identify guilds` +
    `&state=${state}`;

  return NextResponse.redirect(url);
}

export async function POST(req: Request) {
  const { code, state } = await req.json();

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
  });

  const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  const token = await tokenRes.json();
  if (!token.access_token) {
    return NextResponse.json({ error: 'OAuth failed' }, { status: 400 });
  }

  const res = NextResponse.json({ success: true, state });

  res.cookies.set('discord_token', token.access_token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
  });

  return res;
}
