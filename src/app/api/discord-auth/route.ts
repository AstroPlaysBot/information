import { NextResponse } from 'next/server';
import { ADMIN_USER_IDS } from '@/data/admins';

const DISCORD_TOKEN_URL = 'https://discord.com/api/oauth2/token';
const DISCORD_USER_URL = 'https://discord.com/api/users/@me';

export async function GET(req: Request) {
  try {
    const code = new URL(req.url).searchParams.get('code');

    // 1️⃣ Prüfen ob Code vorhanden
    if (!code) {
      console.warn('Discord OAuth hat keinen Code zurückgegeben.');
      return NextResponse.redirect('/'); // normale Weiterleitung
    }

    // 2️⃣ Env-Variablen prüfen
    const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
    const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
    const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/discord-auth`;

    if (!CLIENT_ID || !CLIENT_SECRET || !process.env.NEXT_PUBLIC_APP_URL) {
      console.error('Env-Variablen fehlen für Discord OAuth.');
      return NextResponse.redirect('/'); // keine sensiblen Infos ausgeben
    }

    // 3️⃣ Token von Discord abrufen
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
      console.warn('Discord hat kein Access Token zurückgegeben:', tokenData);
      return NextResponse.redirect('/');
    }

    // 4️⃣ Discord User abrufen
    const userRes = await fetch(DISCORD_USER_URL, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const user = await userRes.json();

    if (!user?.id) {
      console.warn('Discord User konnte nicht abgerufen werden:', user);
      return NextResponse.redirect('/');
    }

    // 5️⃣ Admin prüfen und Weiterleitung
    const isAdmin = ADMIN_USER_IDS.includes(user.id);
    const redirectUrl = isAdmin ? `/login?discord_id=${user.id}` : `/dashboard?discord_id=${user.id}`;

    const response = NextResponse.redirect(redirectUrl);

    // 6️⃣ Cookie setzen
    response.cookies.set('discord_id', user.id, { path: '/' });

    return response;
  } catch (err) {
    console.error('Fehler in /api/discord-auth:', err);
    return NextResponse.redirect('/'); // niemals 500 rausgeben
  }
}
