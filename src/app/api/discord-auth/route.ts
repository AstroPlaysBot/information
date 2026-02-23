
import { NextResponse } from 'next/server';

const CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const redirectParam = url.searchParams.get('redirect'); // z.B. "moderator"

  // 🔹 Wenn kein Code da ist, starten wir OAuth
  if (!code) {
    const redirectUri = `${APP_URL}/api/discord-auth`;
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=identify&state=apply_${redirectParam || ''}`;

    return NextResponse.redirect(discordAuthUrl);
  }

  // 🔹 Code ist da → Token holen
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
    console.error('Token Error:', tokenData);
    return NextResponse.redirect(`${APP_URL}/login?error=oauth_failed`);
  }

  // 🔹 User Infos holen
  const userRes = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const userData = await userRes.json();

  // 🔹 Redirect nach OAuth
  let redirectTo = '/dashboard';
  const state = url.searchParams.get('state'); // z.B. apply_moderator
  if (state && state.startsWith('apply_')) {
    const role = state.replace('apply_', ''); // nur "moderator"
    redirectTo = `/apply/${role}`;           // jetzt korrekt: /apply/moderator
  }

  return NextResponse.redirect(`${APP_URL}${redirectTo}?token=${tokenData.access_token}`);
}
