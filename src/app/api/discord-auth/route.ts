
import { NextResponse } from 'next/server';

const CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  if (!code) return NextResponse.redirect(`${APP_URL}/login?error=no_code`);

  // Token holen
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
    console.error('Token Error:', tokenData);
    return NextResponse.redirect(`${APP_URL}/login?error=oauth_failed`);
  }

  // User Infos
  const userRes = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const userData = await userRes.json();

  // Adminboard?
  if (state === 'adminboard') {
    // Hier kannst du prüfen, ob Rolle vorhanden
    const checkRes = await fetch(`${APP_URL}/api/admin-check`, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const checkJson = await checkRes.json();
    if (checkJson.allowed) {
      return NextResponse.redirect(`${APP_URL}/adminboard`);
    } else {
      return NextResponse.redirect(`${APP_URL}/?error=admin_forbidden`);
    }
  }

  // Normaler Dashboard-Redirect
  return NextResponse.redirect(`${APP_URL}/dashboard?token=${tokenData.access_token}`);
}

// Optional für Client-Fetch (Dashboard)
export async function POST(req: Request) {
  const body = await req.json();
  const code = body.code;
  if (!code) return NextResponse.json({ error: 'No code provided' }, { status: 400 });

  // Token holen wie oben
  const params = new URLSearchParams();
  params.append('client_id', CLIENT_ID);
  params.append('client_secret', CLIENT_SECRET);
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', `${APP_URL}/dashboard`);
  params.append('scope', 'identify guilds');

  const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) return NextResponse.json({ error: 'OAuth failed' }, { status: 400 });

  // User Guilds abrufen
  const guildsRes = await fetch('https://discord.com/api/users/@me/guilds', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const guilds = await guildsRes.json();

  return NextResponse.json({ guilds });
}
