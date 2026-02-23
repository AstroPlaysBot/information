// app/api/discord-callback/route.ts
import { NextResponse } from 'next/server';

const CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state') || 'dashboard';

    console.log('[Discord Callback] Incoming GET request');
    console.log('Code:', code);
    console.log('State:', state);
    console.log('Redirect URI used for token exchange:', `${APP_URL}/api/discord-callback`);

    if (!code) {
      console.error('[Discord Callback] No code found in request');
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
    console.log('[Discord Callback] Token response:', tokenData);

    if (!tokenData.access_token) {
      console.error('[Discord Callback] No access_token in response');
      return NextResponse.redirect(`${APP_URL}/?error=oauth`);
    }

    // Cookie setzen und weiterleiten
    const res = NextResponse.redirect(`${APP_URL}/${state === 'adminboard' ? 'adminboard' : 'dashboard'}`);
    res.cookies.set('discord_token', tokenData.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    });

    console.log('[Discord Callback] Cookie set and redirecting to:', state);

    return res;
  } catch (err) {
    console.error('[Discord Callback] Error:', err);
    return NextResponse.redirect(`${APP_URL}/?error=oauth`);
  }
}
