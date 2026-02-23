import { NextResponse } from 'next/server';

const CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

// ⭐ EINE zentrale redirect_uri
const REDIRECT_URI = `${APP_URL}/dashboard`;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const state = url.searchParams.get('state') || '';

  // 1️⃣ OAuth starten → IMMER zu /dashboard zurück
  const discordAuthUrl =
    `https://discord.com/api/oauth2/authorize` +
    `?client_id=${CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&response_type=code` +
    `&scope=identify guilds` +
    `&state=${state}`;

  return NextResponse.redirect(discordAuthUrl);
}

// 2️⃣ Token-Tausch (vom Dashboard aus)
export async function POST(req: Request) {
  try {
    const { code } = await req.json();
    if (!code) {
      return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    const params = new URLSearchParams();
    params.append('client_id', CLIENT_ID);
    params.append('client_secret', CLIENT_SECRET);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', REDIRECT_URI);

    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      return NextResponse.json(
        { error: 'OAuth failed', details: tokenData },
        { status: 400 }
      );
    }

    // User
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const userData = await userRes.json();

    // Guilds (nur Owner)
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
