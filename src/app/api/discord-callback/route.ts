import { NextResponse } from 'next/server';

const CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state') || 'dashboard';

    if (!code) {
      return NextResponse.redirect(`${APP_URL}/?error=oauth`);
    }

    // Token tauschen
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: `${APP_URL}/api/discord-callback`,
    });

    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      return NextResponse.redirect(`${APP_URL}/?error=oauth`);
    }

    // Cookie setzen
    const res = NextResponse.redirect(`${APP_URL}/${state === 'adminboard' ? 'adminboard' : 'dashboard'}`);
    res.cookies.set('discord_token', tokenData.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    });

    return res;
  } catch (err) {
    console.error('Discord Callback Error:', err);
    return NextResponse.redirect(`${APP_URL}/?error=oauth`);
  }
}
