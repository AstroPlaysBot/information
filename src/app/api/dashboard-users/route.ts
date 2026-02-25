import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET: Alle Dashboard Users
export async function GET() {
  const users = await prisma.dashboardUser.findMany();
  return NextResponse.json(users);
}

// POST: User hinzufügen
export async function POST(req: Request) {
  const { discordId } = await req.json();
  if (!discordId) return NextResponse.json({ error: 'Keine Discord ID angegeben' }, { status: 400 });

  // Discord API für Username abrufen
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
}

// DELETE: User entfernen
export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.dashboardUser.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
