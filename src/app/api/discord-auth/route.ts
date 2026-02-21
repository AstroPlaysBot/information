import { NextResponse } from 'next/server';

const CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;
const ADMIN_GUILD_ID = process.env.ADMIN_GUILD_ID!; // Dein Server
const ADMIN_ROLE_ID = process.env.ADMIN_ROLE_ID!;   // Role-ID für Admins

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  if (!code) return NextResponse.redirect(`${APP_URL}/login?error=no_code`);

  // Token abrufen
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
  if (!tokenData.access_token)
    return NextResponse.redirect(`${APP_URL}/login?error=oauth_failed`);

  // User & Guilds abrufen
  const userRes = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const userData = await userRes.json();

  const guildsRes = await fetch('https://discord.com/api/users/@me/guilds', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const guilds = await guildsRes.json();

  let redirectPath = '/dashboard';

  // Adminboard nur für User mit Rolle auf bestimmten Server
  if (state === 'adminboard') {
    const adminGuild = guilds.find((g: any) => g.id === ADMIN_GUILD_ID);
    if (!adminGuild || !(adminGuild.owner || adminGuild.permissions & 0x8)) {
      // 0x8 = Administrator permission
      redirectPath = '/'; // Kein Admin → zurück auf Homepage
    } else {
      redirectPath = '/adminboard';
    }
  }

  return NextResponse.redirect(`${APP_URL}${redirectPath}`);
}
