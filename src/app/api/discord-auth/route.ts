// src/app/api/discord-auth/route.ts
import { NextResponse } from 'next/server';
import { ADMIN_USER_IDS } from '@/data/admins';

export const dynamic = 'force-dynamic';

const DISCORD_TOKEN_URL = 'https://discord.com/api/oauth2/token';
const DISCORD_USER_URL = 'https://discord.com/api/users/@me';

export async function GET(req: Request) {
  try {
    const code = new URL(req.url).searchParams.get('code');

    if (!code) {
      return NextResponse.redirect(process.env.NEXT_PUBLIC_APP_URL!);
    }

    const CLIENT_ID = process.env.DISCORD_CLIENT_ID!;
    const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;
    const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/discord-auth`;

    // 1️⃣ Token holen
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
      return NextResponse.redirect(process.env.NEXT_PUBLIC_APP_URL!);
    }

    // 2️⃣ User holen
    const userRes = await fetch(DISCORD_USER_URL, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const user = await userRes.json();

    if (!user?.id) {
      return NextResponse.redirect(process.env.NEXT_PUBLIC_APP_URL!);
    }

    const isAdmin = ADMIN_USER_IDS.includes(user.id);

    const response = NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/login`
    );

    // 3️⃣ Cookie setzen (30 Minuten)
    response.cookies.set(
      isAdmin ? 'admin_token' : 'user_token',
      user.id,
      {
        httpOnly: true,
        maxAge: 60 * 30,
        path: '/',
      }
    );

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.redirect(process.env.NEXT_PUBLIC_APP_URL!);
  }
}
