import { NextResponse } from 'next/server';

const CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state'); // "/apply/moderator", "dashboard", "adminboard"

  // 🔹 Schritt 1: Kein Code → OAuth starten
  if (!code) {
    const redirectUri = `${APP_URL}/api/discord-auth`;
    const discordAuthUrl =
      `https://discord.com/api/oauth2/authorize` +
      `?client_id=${CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=identify` +
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
  params.append('scope', 'identify');

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

  // 🔹 Schritt 5: Adminboard-Check (falls adminboard)
  if (redirectTo === '/adminboard') {
    const hasAdminRole = await checkAdminRole(userData.id);
    if (!hasAdminRole) {
      console.error('DEBUG: Admin check failed for user', userData.id);
      return NextResponse.redirect(`${APP_URL}/login?error=no_admin`);
    }
  }

  // 🔹 Schritt 6: Weiterleitung mit Token
  return NextResponse.redirect(`${APP_URL}${redirectTo}?token=${tokenData.access_token}`);
}

// 🔹 Helper-Funktion: Prüft Admin-Rolle über Bot + Debug
async function checkAdminRole(userId: string) {
  const GUILD_ID = '1462894776671277241';
  const ROLE_ID = '1474507057154756919';
  try {
    const memberRes = await fetch(
      `https://discord.com/api/guilds/${GUILD_ID}/members/${userId}`,
      {
        headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
      }
    );

    console.log('DEBUG: Member fetch status:', memberRes.status);
    const text = await memberRes.text();
    console.log('DEBUG: Member fetch response text:', text);

    if (!memberRes.ok) return false;

    const member = JSON.parse(text);
    console.log('DEBUG: Member fetched:', member);
    console.log('DEBUG: Roles array:', member.roles);

    return member.roles.includes(ROLE_ID);
  } catch (err) {
    console.error('DEBUG: Admin check error:', err);
    return false;
  }
}
