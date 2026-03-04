// src/app/api/guilds/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export type RoleType = 'OWNER' | 'CO_OWNER' | 'PARTNER';

export async function GET() {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('admin_token')?.value || cookieStore.get('user_token')?.value;

    if (!accessToken) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 });

    // Discord User abrufen
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!userRes.ok) throw new Error('Discord User API Fehler');

    const userRaw = await userRes.json();
    const userId = userRaw.id;

    // DashboardUser upsert
    await prisma.dashboardUser.upsert({
      where: { discordId: userId },
      update: { username: userRaw.username, avatar: userRaw.avatar ?? null },
      create: { discordId: userId, username: userRaw.username, avatar: userRaw.avatar ?? null },
    });

    // ======================
    // Alle Server abrufen, bei denen der User eine Rolle hat und BotJoined = true
    // ======================
    const servers = await prisma.serverUser.findMany({
      where: {
        userId,
        role: { in: ['OWNER', 'CO_OWNER', 'PARTNER'] },
        server: { botJoined: true },
      },
      include: { server: true },
    });

    const guilds = servers.map(s => ({
      id: s.server.id,
      name: s.server.name,
      icon: s.server.icon,
      role: s.role as RoleType,
    }));

    // Sortieren nach Rolle: OWNER > CO_OWNER > PARTNER
    const priority: Record<RoleType, number> = { OWNER: 0, CO_OWNER: 1, PARTNER: 2 };
    guilds.sort((a, b) => priority[a.role] - priority[b.role]);

    return NextResponse.json({ guilds });
  } catch (err: any) {
    console.error('Server Route Fehler:', err);
    return NextResponse.json({ error: err.message || 'Serverfehler' }, { status: 500 });
  }
}
