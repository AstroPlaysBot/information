// app/api/discord-auth/route.ts
import { NextResponse } from 'next/server';

const CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

// zentrale Callback-Route
const REDIRECT_URI = `${APP_URL}/api/discord-callback`;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const state = searchParams.get('state') ?? 'dashboard';

  const url =
    `https://discord.com/api/oauth2/authorize` +
    `?client_id=${CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&response_type=code` +
    `&scope=identify guilds` +
    `&state=${state}`;

  return NextResponse.redirect(url);
}
