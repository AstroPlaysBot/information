// src/app/api/discord-auth/route.ts
import { NextRequest, NextResponse } from 'next/server';

const CLIENT_ID = process.env.DISCORD_CLIENT_ID!;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;
const REDIRECT_URI = process.env.DISCORD_REDIRECT_URI!;

if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
  throw new Error('Discord environment variables not set');
}

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get('code');
    if (!code) {
      return NextResponse.json({ error: 'Missing code parameter' }, { status: 400 });
    }

    // Token anfordern
    const params = new URLSearchParams();
    params.append('client_id', CLIENT_ID);
    params.append('client_secret', CLIENT_SECRET);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', REDIRECT_URI);

    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(), // ⚡ Wichtig: body muss String sein
    });

    if (!tokenRes.ok) {
      const text = await tokenRes.text();
      console.error('Discord token request failed:', text);
      return NextResponse.json({ error: 'Failed to get Discord token', details: text }, { status: 500 });
    }

    const tokenData = await tokenRes.json();

    // Userdaten abrufen
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!userRes.ok) {
      const text = await userRes.text();
      console.error('Discord user fetch failed:', text);
      return NextResponse.json({ error: 'Failed to fetch Discord user', details: text }, { status: 500 });
    }

    const userData = await userRes.json();

    // ⚡ Optional: HttpOnly Cookie setzen
    const response = NextResponse.json({ token: tokenData, user: userData });
    response.cookies.set('discord_token', tokenData.access_token, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: tokenData.expires_in,
    });

    return response;
  } catch (err) {
    console.error('Discord Auth error:', err);
    return NextResponse.json({ error: 'Internal server error', details: (err as any).message }, { status: 500 });
  }
}
