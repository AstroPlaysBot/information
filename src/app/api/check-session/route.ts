// src/app/api/check-session/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const ADMIN_GUILD_ID = process.env.ADMIN_GUILD_ID!;
const ADMIN_ROLE_ID = process.env.ADMIN_ROLE_ID!;
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN!;

export async function GET() {
  try {
    const token = cookies().get('discord_token')?.value;
    if (!token) return NextResponse.json({ isUser: false, isAdmin: false });

    // 🔹 User Daten
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!userRes.ok) return NextResponse.json({ isUser: false, isAdmin: false });

    const user = await userRes.json();

    // 🔹 Admin Check über Bot
    const memberRes = await fetch(
      `https://discord.com/api/guilds/${ADMIN_GUILD_ID}/members/${user.id}`,
      { headers: { Authorization: `Bot ${BOT_TOKEN}` } }
    );

    const member = memberRes.ok ? await memberRes.json() : { roles: [] };
    const isAdmin = Array.isArray(member.roles) && member.roles.includes(ADMIN_ROLE_ID);

    return NextResponse.json({
      isUser: true,
      isAdmin,
      username: user.username,
      avatar: user.avatar ?? null,
      id: user.id,
    });
  } catch (err) {
    console.error('Check-session error:', err);
    return NextResponse.json({ isUser: false, isAdmin: false });
  }
}
