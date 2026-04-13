import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

function getDiscordCreationDate(id: string) {
  const discordEpoch = 1420070400000;
  return new Date(Number(BigInt(id) >> 22n) + discordEpoch);
}

export async function GET() {
  const token =
    cookies().get('user_token')?.value ||
    cookies().get('admin_token')?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const res = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const user = await res.json();

    const accountCreated = getDiscordCreationDate(user.id);

    const avatarUrl = user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith('a_') ? 'gif' : 'png'}`
      : null;

    // 🔥 BAN CHECK ADDED
    const ban = await prisma.applicationBan.findUnique({
      where: { discordId: user.id }
    });

    const isBanned =
      ban && new Date(ban.bannedUntil).getTime() > Date.now();

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        global_name: user.global_name,
        discriminator: user.discriminator,
        avatar: avatarUrl,
        created_at: accountCreated,

        // 🔥 NEW
        banned: isBanned,
        bannedUntil: ban?.bannedUntil || null
      },
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
