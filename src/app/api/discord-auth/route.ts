// src/app/api/discord-auth/route.ts
import { NextRequest, NextResponse } from 'next/server';

const CLIENT_ID = process.env.DISCORD_CLIENT_ID!;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;
const REDIRECT_URI = process.env.DISCORD_REDIRECT_URI!;

// Schon hier sicherstellen, dass sie existieren
if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
  throw new Error('Discord environment variables not set');
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: 'Missing code parameter' }, { status: 400 });
    }

    // Token anfordern
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
    } as Record<string, string>); // <-- hier erzwingt TypeScript String

    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });

    if (!tokenRes.ok) {
      const text = await tokenRes.text();
      console.error('Discord token request failed:', text);
      return NextResponse.json({ error: 'Failed to get Discord token', details: text }, { status: 500 });
    }

    const tokenData = await tokenRes.json();

    // Optional: Userdaten abrufen
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!userRes.ok) {
      const text = await userRes.text();
      console.error('Discord user fetch failed:', text);
      return NextResponse.json({ error: 'Failed to fetch Discord user', details: text }, { status: 500 });
    }

    const userData = await userRes.json();

    return NextResponse.json({ token: tokenData, user: userData });
  } catch (err) {
    console.error('Discord Auth error:', err);
    return NextResponse.json({ error: 'Internal server error', details: (err as any).message }, { status: 500 });
  }
}
