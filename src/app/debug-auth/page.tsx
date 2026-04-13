import { NextResponse } from 'next/server';
import { isAdmin } from '@/data/admins';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const DISCORD_TOKEN_URL = 'https://discord.com/api/oauth2/token';
const DISCORD_USER_URL = 'https://discord.com/api/users/@me';

function safeStringify(obj: any) {
  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return '❌ Cannot stringify';
  }
}

export async function GET(req: Request) {
  const debug: any = {
    step: 'start',
    error: null,
    message: null,
    raw: {},
  };

  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');

    debug.step = 'check_code';
    debug.raw.code = code;

    if (!code) {
      debug.step = 'no_code';
      return NextResponse.json(debug);
    }

    const CLIENT_ID = process.env.DISCORD_CLIENT_ID!;
    const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;
    const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/discord-auth`;

    // 1️⃣ TOKEN
    debug.step = 'token_request';

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
    debug.raw.tokenData = tokenData;

    if (!tokenData.access_token) {
      debug.step = 'token_failed';
      debug.error = 'no_access_token';
      return NextResponse.json(debug);
    }

    // 2️⃣ USER
    debug.step = 'user_request';

    const userRes = await fetch(DISCORD_USER_URL, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const user = await userRes.json();
    debug.raw.user = user;

    if (!user?.id) {
      debug.step = 'user_failed';
      debug.error = 'no_user_id';
      return NextResponse.json(debug);
    }

    // 3️⃣ DB CHECK
    debug.step = 'db_check';

    let exitBan = null;
    try {
      exitBan = await prisma.applicationBan.findUnique({
        where: { discordId: user.id },
      });
    } catch (e: any) {
      debug.step = 'db_error';
      debug.error = e.message;
      return NextResponse.json(debug);
    }

    debug.raw.exitBan = exitBan;

    const isInBan =
      exitBan && new Date(exitBan.bannedUntil).getTime() > Date.now();

    debug.raw.isInBan = isInBan;

    // 4️⃣ ADMIN CHECK
    debug.step = 'admin_check';

    let adminCheck = false;
    try {
      adminCheck = await isAdmin(user.id);
    } catch (e: any) {
      debug.step = 'admin_error';
      debug.error = e.message;
      return NextResponse.json(debug);
    }

    debug.raw.adminCheck = adminCheck;

    // 5️⃣ RESULT
    debug.step = 'decision';

    const target = adminCheck && !isInBan ? '/adminboard' : '/dashboard';

    debug.raw.target = target;

    const response = NextResponse.json(debug);

    // ⚠️ KEIN REDIRECT im DEBUG
    response.cookies.set('debug_token', tokenData.access_token);

    return response;
  } catch (err: any) {
    debug.step = 'error';
    debug.error = err?.message || 'unknown error';
    debug.raw.full = safeStringify(err);

    return NextResponse.json(debug);
  }
}
