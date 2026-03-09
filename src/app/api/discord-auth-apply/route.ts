import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const DISCORD_TOKEN_URL = 'https://discord.com/api/oauth2/token';
const DISCORD_USER_URL = 'https://discord.com/api/users/@me';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state') || '/apply';

    const CLIENT_ID = process.env.DISCORD_CLIENT_ID!;
    const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;
    const REDIRECT_URI = `${APP_URL}/api/discord-auth-apply`;

    // 🔹 Kein Code → OAuth starten
    if (!code) {
      const discordLogin = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
        REDIRECT_URI
      )}&scope=identify&state=${encodeURIComponent(state)}`;

      return NextResponse.redirect(discordLogin);
    }

    // 🔹 Token holen
    const tokenRes = await fetch(DISCORD_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      return NextResponse.redirect(`${APP_URL}${state}`);
    }

    // 🔹 Cookie setzen
    const response = NextResponse.redirect(`${APP_URL}${state}`);
    response.cookies.set('user_token', tokenData.access_token, {
      httpOnly: true,
      maxAge: 60 * 60,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/`);
  }
}
