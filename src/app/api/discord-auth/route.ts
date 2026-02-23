import { NextResponse } from 'next/server';

const CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const redirectParam = url.searchParams.get('redirect'); // Bewerbungsrole
  const state = url.searchParams.get('state'); // optional: dashboard/adminboard/apply

  // Kein Code → OAuth starten
  if (!code) {
    let oauthState = 'dashboard';
    if (redirectParam) oauthState = `apply_${redirectParam}`;
    else if (state) oauthState = state;

    const redirectUri = `${APP_URL}/api/discord-auth`;
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=identify&state=${oauthState}`;

    return NextResponse.redirect(discordAuthUrl);
  }

  // Code vorhanden → Token holen
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

  // User Infos
  const userRes = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const userData = await userRes.json();

  // Redirect je nach Flow
  let redirectTo = '/dashboard';
  const currentState = url.searchParams.get('state');

  if (currentState) {
    if (currentState.startsWith('apply_')) {
      const role = currentState.replace('apply_', '');
      redirectTo = `/apply/${role}`;
    } else if (currentState === 'adminboard') {
      redirectTo = '/adminboard';
    } else if (currentState === 'dashboard') {
      redirectTo = '/dashboard';
    }
  }

  return NextResponse.redirect(`${APP_URL}${redirectTo}?token=${tokenData.access_token}`);
}

// POST → Dashboard/Adminboard
export async function POST(req: Request) {
  const body = await req.json();
  const code = body.code;
  if (!code) return NextResponse.json({ error: 'No code provided' }, { status: 400 });

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
  if (!tokenData.access_token) return NextResponse.json({ error: 'OAuth failed' }, { status: 400 });

  // User Infos
  const userRes = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const userData = await userRes.json();

  // Guilds für Dashboard
  const guildsRes = await fetch('https://discord.com/api/users/@me/guilds', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const guilds = await guildsRes.json();

  return NextResponse.json({ guilds, user: userData });
}
