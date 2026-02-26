// src/app/api/guild-users/[guildId]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { guildId: string } }) {
  const { guildId } = params;
  const users = await prisma.user.findMany({
    where: { guildId },
  });
  return NextResponse.json(users);
}

export async function POST(req: Request, { params }: { params: { guildId: string } }) {
  try {
    const { guildId } = params;
    const { discordId, username } = await req.json();
    if (!discordId) return NextResponse.json({ error: 'discordId fehlt' }, { status: 400 });

    const newUser = await prisma.user.create({
      data: {
        discordId,
        username: username || `User#${Math.floor(Math.random() * 9999)}`,
        guildId,
      },
    });
    return NextResponse.json(newUser);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unbekannter Fehler' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { guildId: string } }) {
  try {
    const { guildId } = params;
    const { id } = await req.json();
    await prisma.user.deleteMany({
      where: { id, guildId },
    });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unbekannter Fehler' }, { status: 500 });
  }
}
