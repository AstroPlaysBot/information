// app/api/discord-callback/route.ts
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // <<< hier hinzufügen

const CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

export async function GET(req: Request) {
  try {
    console.log('[Discord Callback] Start');

    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state') || 'dashboard';

    console.log('[Discord Callback] code:', code, 'state:', state);

    if (!code) {
      console.log('[Discord Callback] Kein code, redirect error');
      return NextResponse.redirect(`${APP_URL}/?error=oauth`);
    }

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
    console.log('[Discord Callback] tokenData:', tokenData);

    if (!tokenData.access_token) {
      console.log('[Discord Callback] Kein access_token, redirect error');
      return NextResponse.redirect(`${APP_URL}/?error=oauth`);
    }

    const res = NextResponse.redirect(
      `${APP_URL}/${state === 'adminboard' ? 'adminboard' : 'dashboard'}`
    );
    res.cookies.set('discord_token', tokenData.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    });

    console.log('[Discord Callback] Redirecting with token set');
    return res;
  } catch (err) {
    console.error('Discord Callback Error:', err);
    return NextResponse.redirect(`${APP_URL}/?error=oauth`);
  }
}
