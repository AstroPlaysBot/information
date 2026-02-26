// src/app/api/dashboard-users/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // dein Prisma-Client

export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  try {
    const { discordId, username } = await req.json();
    if (!discordId) return NextResponse.json({ error: 'discordId fehlt' }, { status: 400 });

    const newUser = await prisma.user.create({
      data: {
        discordId,
        username: username || `User#${Math.floor(Math.random() * 9999)}`,
      },
    });
    return NextResponse.json(newUser);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unbekannter Fehler' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unbekannter Fehler' }, { status: 500 });
  }
}
