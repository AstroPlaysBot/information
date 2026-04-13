import { NextResponse } from 'next/server';
import { isAdmin } from '@/data/admins';
import prisma from "@/lib/prisma";

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

    console.log("➡️ AUTH START");

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

    if (!tokenData.access_token) {
      return NextResponse.redirect(process.env.NEXT_PUBLIC_APP_URL!);
    }

    console.log("✅ TOKEN OK");

    // 2️⃣ USER
    const userRes = await fetch(DISCORD_USER_URL, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const user = await userRes.json();

    if (!user?.id) {
      return NextResponse.redirect(process.env.NEXT_PUBLIC_APP_URL!);
    }

    console.log("👤 USER OK:", user.id);

    // 3️⃣ ADMIN CHECK
    const adminCheck = await isAdmin(user.id);

    // 4️⃣ EXIT QUEUE CHECK (48h freeze)
    const exitEntry = await prisma.adminExitQueue.findUnique({
      where: { discordId: user.id }
    });

    const isFrozen =
      exitEntry && new Date(exitEntry.deleteAt).getTime() > Date.now();

    console.log("❄️ FREEZE:", isFrozen);

    const target = adminCheck ? '/adminboard' : '/dashboard';

    const response = NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}${target}`
    );

    // 🟢 NORMAL USER
    if (!adminCheck) {
      response.cookies.set('user_token', tokenData.access_token, {
        httpOnly: true,
        maxAge: 60 * 30,
        path: '/',
      });

      return response;
    }

    // ❄️ ADMIN FROZEN → downgrade zu USER
    if (isFrozen) {
      response.cookies.set('user_token', tokenData.access_token, {
        httpOnly: true,
        maxAge: 60 * 30,
        path: '/',
      });

      return response;
    }

    // 👑 ACTIVE ADMIN
    response.cookies.set('admin_token', tokenData.access_token, {
      httpOnly: true,
      maxAge: 60 * 30,
      path: '/',
    });

    return response;

  } catch (err) {
    console.error("❌ AUTH ERROR:", err);
    return NextResponse.redirect(process.env.NEXT_PUBLIC_APP_URL!);
  }
}
