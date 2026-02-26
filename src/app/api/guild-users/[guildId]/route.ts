// src/app/api/guild-users/[guildId]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { guildId: string } }) {
  const { guildId } = params;
  if (!guildId) return NextResponse.json({ error: 'guildId fehlt' }, { status: 400 });

  // Hier kannst du filtern, falls du ein Feld für guildId hast
  const users = await prisma.dashboardUser.findMany({
    where: { discordId: { not: null } } // Beispielfilter, anpassen falls du guildId speicherst
  });

  return NextResponse.json(users);
}
