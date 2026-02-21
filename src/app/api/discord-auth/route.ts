import { NextResponse } from 'next/server';

const CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!; // z.B. https://deine-domain.de

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state'); // 'dashboard' oder 'adminboard'

  if (!code) {
    return NextResponse.redirect(`${APP_URL}/login?error=no_code`);
  }

  // Token bei Discord abrufen
  const params = new URLSearchParams();
  params.append('client_id', CLIENT_ID);
  params.append('client_secret', CLIENT_SECRET);
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', `${APP_URL}/api/discord-auth`); // MUSS exakt so im Discord-Portal stehen
  params.append('scope', 'identify guilds');

  const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    return NextResponse.redirect(`${APP_URL}/login?error=oauth_failed`);
  }

  // User Infos abrufen
  const userRes = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const userData = await userRes.json();

  // Optional: Guilds abrufen
  const guildsRes = await fetch('https://discord.com/api/users/@me/guilds', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const guilds = await guildsRes.json();

  // Hier entscheidest du wohin weitergeleitet wird
  const redirectPath = state === 'adminboard' ? '/adminboard' : '/dashboard';

  // Optional: User/Guilds im Cookie/Session speichern (z.B. JWT)
  // ...

  return NextResponse.redirect(`${APP_URL}${redirectPath}`);
}
