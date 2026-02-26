// src/app/api/guild-users/[guildId]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { guildId: string } }) {
  const { guildId } = params;
  if (!guildId) return NextResponse.json({ error: 'guildId fehlt' }, { status: 400 });

  // Alle DashboardUser zurückgeben, optional später nach guildId filtern
  const users = await prisma.dashboardUser.findMany();

  return NextResponse.json(users);
}
