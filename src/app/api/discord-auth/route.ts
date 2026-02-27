import { NextResponse } from 'next/server';
import { ADMIN_USER_IDS } from '@/data/admins';

export const dynamic = 'force-dynamic'; // Wichtig für dynamische Server-API

const DISCORD_TOKEN_URL = 'https://discord.com/api/oauth2/token';
const DISCORD_USER_URL = 'https://discord.com/api/users/@me';

export async function GET(req: Request) {
  try {
    // nur serverseitig: URL aus req.nextUrl
    const code = new URL(req.url).searchParams.get('code');
    if (!code) {
      console.warn('Kein Discord Code erhalten.');
      return NextResponse.redirect(process.env.NEXT_PUBLIC_APP_URL!);
    }

    const CLIENT_ID = process.env.DISCORD_CLIENT_ID!;
    const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;
    const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/discord-auth`;

    if (!CLIENT_ID || !CLIENT_SECRET || !process.env.NEXT_PUBLIC_APP_URL) {
      console.error('Env-Variablen fehlen!');
      return NextResponse.redirect(process.env.NEXT_PUBLIC_APP_URL!);
    }

    // Token abrufen
    const tokenRes = await fetch(DISCORD_TOKEN_URL, {
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
    if (!tokenData.access_token) {
      console.warn('Discord Access Token fehlt:', tokenData);
      return NextResponse.redirect(process.env.NEXT_PUBLIC_APP_URL!);
    }

    // User abrufen
    const userRes = await fetch(DISCORD_USER_URL, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const user = await userRes.json();
    if (!user?.id) {
      console.warn('Discord User konnte nicht abgerufen werden:', user);
      return NextResponse.redirect(process.env.NEXT_PUBLIC_APP_URL!);
    }

    // Admin prüfen
    const isAdmin = ADMIN_USER_IDS.includes(user.id);
    const redirectUrl = isAdmin
      ? `${process.env.NEXT_PUBLIC_APP_URL}/login?discord_id=${user.id}`
      : `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?discord_id=${user.id}`;

    const response = NextResponse.redirect(redirectUrl);
    response.cookies.set('discord_id', user.id, { path: '/' });
    return response;
  } catch (err) {
    console.error('Fehler in /api/discord-auth:', err);
    return NextResponse.redirect(process.env.NEXT_PUBLIC_APP_URL!);
  }
}
