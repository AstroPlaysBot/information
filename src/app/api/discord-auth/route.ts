import { NextResponse } from 'next/server';

const CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const redirectParam = url.searchParams.get('redirect'); // z.B. apply/moderator

  if (!code) {
    const redirectUri = `${APP_URL}/api/discord-auth`;
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=identify%20guilds&state=${redirectParam || ''}`;

    return NextResponse.redirect(discordAuthUrl);
  }

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
  if (!tokenData.access_token) return NextResponse.redirect(`${APP_URL}/login?error=oauth_failed`);

  // User Infos
  const userRes = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const userData = await userRes.json();

  // Optional: Dashboard-Redirect
  const state = url.searchParams.get('state');
  let redirectTo = '/dashboard';
  if (state && state.startsWith('apply_')) {
    redirectTo = `/apply/${state.replace('apply_', '')}`;
  } else if (state === 'dashboard') {
    redirectTo = `/dashboard?token=${tokenData.access_token}`;
  }

  return NextResponse.redirect(`${APP_URL}${redirectTo}?token=${tokenData.access_token}`);
}

// POST für Dashboard-Client
export async function POST(req: Request) {
  try {
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
    if (!tokenData.access_token) return NextResponse.json({ error: 'OAuth failed', details: tokenData }, { status: 400 });

    // User Infos
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const userData = await userRes.json();

    // Guilds abrufen + nur Owner
    const guildRes = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const guildsData = await guildRes.json();
    const guilds = guildsData.filter((g: any) => g.owner);

    return NextResponse.json({ user: userData, guilds });
  } catch (err) {
    console.error('DISCORD POST ERROR:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
