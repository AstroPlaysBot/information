// src/app/api/discord-auth/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const CLIENT_ID = process.env.DISCORD_CLIENT_ID!;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;
const REDIRECT_URI = process.env.DISCORD_REDIRECT_URI!;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  // 🔹 1. Kein Code → zu Discord weiterleiten
  if (!code) {
    const discordAuthUrl =
      `https://discord.com/api/oauth2/authorize` +
      `?client_id=${CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      `&response_type=code` +
      `&scope=identify guilds`;

    return NextResponse.redirect(discordAuthUrl);
  }

  // 🔹 2. Code vorhanden → Token holen
  const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) return NextResponse.redirect('/');

  // 🔐 HttpOnly Cookie setzen
  cookies().set('discord_token', tokenData.access_token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
  });

  // ⚡ Immer auf /login weiterleiten
  return NextResponse.redirect(new URL('/login', req.url));
}
