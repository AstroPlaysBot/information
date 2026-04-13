import { NextResponse } from 'next/server';
import { isAdmin } from '@/data/admins';
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

const DISCORD_TOKEN_URL = 'https://discord.com/api/oauth2/token';
const DISCORD_USER_URL = 'https://discord.com/api/users/@me';

export async function GET(req: Request) {
  try {
    const code = new URL(req.url).searchParams.get('code');
    if (!code) return NextResponse.redirect(process.env.NEXT_PUBLIC_APP_URL!);

    const CLIENT_ID = process.env.DISCORD_CLIENT_ID!;
    const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;
    const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/discord-auth`;

    // 1️⃣ TOKEN
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
    if (!tokenData.access_token)
      return NextResponse.redirect(process.env.NEXT_PUBLIC_APP_URL!);

    // 2️⃣ USER
    const userRes = await fetch(DISCORD_USER_URL, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const user = await userRes.json();
    if (!user?.id)
      return NextResponse.redirect(process.env.NEXT_PUBLIC_APP_URL!);

    // 🔥 CHECK: 30 Tage Admin Sperre
    const exitBan = await prisma.applicationBan.findUnique({
      where: { discordId: user.id }
    });

    const isInBan =
      exitBan && new Date(exitBan.bannedUntil).getTime() > Date.now();

    // 🔥 ADMIN LOGIC:
    const adminCheck = await isAdmin(user.id);

    const target = adminCheck ? '/adminboard' : '/dashboard';

    const response = NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}${target}`
    );

    // 🟢 CASE 1: NORMAL USER (immer erlaubt)
    if (!adminCheck) {
      response.cookies.set('user_token', tokenData.access_token, {
        httpOnly: true,
        maxAge: 60 * 30,
        path: '/',
      });

      return response;
    }

    // 🔴 CASE 2: ADMIN ABER IN 30 TAGE SPERRE
    if (isInBan) {
      response.cookies.set('user_token', tokenData.access_token, {
        httpOnly: true,
        maxAge: 60 * 30,
        path: '/',
      });

      return response;
    }

    // 🟢 CASE 3: ECHTER ADMIN (nur wenn NICHT gebannt)
    response.cookies.set('admin_token', tokenData.access_token, {
      httpOnly: true,
      maxAge: 60 * 30,
      path: '/',
    });

    return response;

  } catch (err) {
    console.error(err);
    return NextResponse.redirect(process.env.NEXT_PUBLIC_APP_URL!);
  }
}
