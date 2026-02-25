// src/app/api/dashboard-users/route.ts
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const token = req.cookies.get('discord_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    // Alle Dashboard-Users aus der DB
    const dbUsers = await prisma.dashboardUser.findMany();

    // Discord API optional aufrufen, um Username aktuell zu halten
    const users = await Promise.all(
      dbUsers.map(async (u) => {
        try {
          const res = await fetch(`https://discord.com/api/users/${u.discordId}`, {
            headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
          });
          if (!res.ok) return u; // Fallback auf DB-Username
          const data = await res.json();
          return { ...u, username: `${data.username}#${data.discriminator}` };
        } catch {
          return u;
        }
      })
    );

    return NextResponse.json(users);
  } catch (err) {
    console.error('Dashboard GET error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { discordId } = await req.json();
  if (!discordId)
    return NextResponse.json({ error: 'Keine Discord ID angegeben' }, { status: 400 });

  try {
    // Discord API aufrufen, um Username zu holen
    const res = await fetch(`https://discord.com/api/users/${discordId}`, {
      headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
    });
    if (!res.ok) return NextResponse.json({ error: 'Discord User nicht gefunden' }, { status: 404 });

    const data = await res.json();
    const username = `${data.username}#${data.discriminator}`;

    const user = await prisma.dashboardUser.create({
      data: { discordId, username },
    });

    return NextResponse.json(user);
  } catch (err) {
    console.error('Dashboard POST error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'Keine ID angegeben' }, { status: 400 });

  try {
    await prisma.dashboardUser.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Dashboard DELETE error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
