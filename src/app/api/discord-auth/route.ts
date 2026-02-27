// app/api/discord-auth/route.ts
import { NextResponse } from 'next/server';
import { ADMIN_USER_IDS } from '@/data/admins';

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/discord-auth`;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login`);
  }

  // 1️⃣ Token von Discord anfordern
  const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: DISCORD_CLIENT_ID!,
      client_secret: DISCORD_CLIENT_SECRET!,
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login`);
  }

  // 2️⃣ Discord User abrufen
  const userRes = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const user = await userRes.json();

  if (!user || !user.id) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login`);
  }

  // 3️⃣ Prüfen, ob Admin
  if (ADMIN_USER_IDS.includes(user.id)) {
    // Admin → zu /login (wo er selber wählen kann)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?discord_id=${user.id}`);
  }

  // Normaler User → direkt Dashboard
  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?discord_id=${user.id}`);
}
