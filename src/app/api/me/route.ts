import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

function getDiscordCreationDate(id: string) {
  const discordEpoch = 1420070400000;
  return new Date(Number(BigInt(id) >> 22n) + discordEpoch);
}

export async function GET() {
  try {
    const cookieStore = cookies();

    const token =
      cookieStore.get('user_token')?.value ||
      cookieStore.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const res = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const user = await res.json();

    if (!user?.id) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const accountCreated = getDiscordCreationDate(user.id);

    const avatarUrl = user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith('a_') ? 'gif' : 'png'}`
      : null;

    // 🔥 SAFE BAN CHECK (NO CRASH EVER)
    let isBanned = false;
    let bannedUntil = null;

    try {
      const ban = await prisma.applicationBan.findUnique({
        where: { discordId: user.id }
      });

      if (ban && new Date(ban.bannedUntil).getTime() > Date.now()) {
        isBanned = true;
        bannedUntil = ban.bannedUntil;
      }
    } catch (e) {
      console.error("BAN CHECK ERROR:", e);
    }

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        global_name: user.global_name,
        discriminator: user.discriminator,
        avatar: avatarUrl,
        created_at: accountCreated,
        banned: isBanned,
        bannedUntil
      },
    });

  } catch (err) {
    console.error("API ME ERROR:", err);

    // 🔥 WICHTIG: NIE 500 RETURNEN (verhindert Apply Crash Loop)
    return NextResponse.json(
      { user: null },
      { status: 200 }
    );
  }
}
