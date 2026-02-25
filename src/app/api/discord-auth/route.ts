import { NextResponse } from 'next/server';

const CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state'); // dashboard, adminboard, /apply/...

  // 🔹 Schritt 1: Kein Code → OAuth starten
  if (!code) {
    const redirectUri = `${APP_URL}/api/discord-auth`;
    const discordAuthUrl =
      `https://discord.com/api/oauth2/authorize` +
      `?client_id=${CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=identify%20guilds` + // unbedingt guilds Scope
      `&state=${encodeURIComponent(state || '')}`;

    return NextResponse.redirect(discordAuthUrl);
  }

  // 🔹 Schritt 2: Code vorhanden → Token holen
  const params = new URLSearchParams();
  params.append('client_id', CLIENT_ID);
  params.append('client_secret', CLIENT_SECRET);
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', `${APP_URL}/api/discord-auth`);
  params.append('scope', 'identify guilds');

  const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    console.error('Discord Token Error:', tokenData);
    return NextResponse.redirect(`${APP_URL}/login?error=oauth_failed`);
  }

  // 🔹 Schritt 3: User Daten holen
  const userRes = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const userData = await userRes.json();

  // 🔹 Schritt 4: Zielseite bestimmen
  let redirectTo = '/dashboard';
  if (state) {
    if (state.startsWith('/apply/')) redirectTo = state;
    else if (state === 'dashboard') redirectTo = '/dashboard';
    else if (state === 'adminboard') redirectTo = '/adminboard';
  }

  const response = NextResponse.redirect(`${APP_URL}${redirectTo}`);

  // 🔹 Token in Cookie setzen – für Dashboard und Adminboard
  response.cookies.set({
    name: 'discord_token',
    value: tokenData.access_token,
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    maxAge: 60 * 15, // 15 Minuten
  });

  return response;
}
