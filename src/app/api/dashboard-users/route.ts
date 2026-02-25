import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const users = await prisma.dashboardUser.findMany();
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const { discordId } = await req.json();
  if (!discordId) return NextResponse.json({ error: 'Keine Discord ID angegeben' }, { status: 400 });

  // Discord API für Username
  const discordRes = await fetch(`https://discord.com/api/users/${discordId}`, {
    headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
  });
  if (!discordRes.ok) return NextResponse.json({ error: 'Discord User nicht gefunden' }, { status: 404 });

  const data = await discordRes.json();
  const username = `${data.username}#${data.discriminator}`;

  const user = await prisma.dashboardUser.create({
    data: { id: crypto.randomUUID(), discordId, username },
  });

  return NextResponse.json(user);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.dashboardUser.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
