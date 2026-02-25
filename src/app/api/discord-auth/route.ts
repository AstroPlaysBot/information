import { NextResponse } from 'next/server';

const CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;
const GUILD_ID = process.env.DISCORD_GUILD_ID!;
const ADMIN_ROLE_ID = process.env.DISCORD_ADMIN_ROLE_ID!;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state'); // 'dashboard' | 'adminboard'

  if (!code) {
    const redirectUri = `${APP_URL}/api/discord-auth`;
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=identify%20guilds%20guilds.members.read&state=${encodeURIComponent(state || 'dashboard')}`;
    return NextResponse.redirect(discordAuthUrl);
  }

  // Token holen
  const params = new URLSearchParams();
  params.append('client_id', CLIENT_ID);
  params.append('client_secret', CLIENT_SECRET);
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', `${APP_URL}/api/discord-auth`);

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

  // User-Daten holen
  const userRes = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const userData = await userRes.json();

  // Für Adminboard prüfen, ob User Rolle + Guild hat
  let allowed = true;
  if (state === 'adminboard') {
    const guildRes = await fetch(`https://discord.com/api/users/@me/guilds`, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const guilds = await guildRes.json();
    const guild = guilds.find((g: any) => g.id === GUILD_ID);
    if (!guild) allowed = false;

    // Rolle checken
    if (allowed) {
      const memberRes = await fetch(`https://discord.com/api/guilds/${GUILD_ID}/members/${userData.id}`, {
        headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
      });
      const member = await memberRes.json();
      if (!member.roles.includes(ADMIN_ROLE_ID)) allowed = false;
    }

    if (!allowed) {
      return NextResponse.redirect(`${APP_URL}/?error=admin_no_access`);
    }
  }

  // Cookie setzen
  const cookieName = state === 'adminboard' ? 'admin_token' : 'dashboard_token';
  const redirectTo = state === 'adminboard' ? '/adminboard' : '/dashboard';

  const response = NextResponse.redirect(`${APP_URL}${redirectTo}`);
  response.cookies.set({
    name: cookieName,
    value: tokenData.access_token,
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    maxAge: 60 * 15, // 15 Minuten
  });

  return response;
}
