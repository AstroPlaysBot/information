import { NextResponse } from 'next/server';

const CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state'); // adminboard

  if (!code) return NextResponse.redirect(`${APP_URL}/login?error=no_code`);

  // Token bei Discord holen
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
    return NextResponse.redirect(`${APP_URL}/login?error=oauth_failed`);
  }

  // Admin-Check
  const checkRes = await fetch(`${APP_URL}/api/admin-check`, {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const checkJson = await checkRes.json();

  if (checkJson.allowed) {
    return NextResponse.redirect(`${APP_URL}/adminboard`);
  } else {
    return NextResponse.redirect(`${APP_URL}/`); // keine Rechte
  }
}
