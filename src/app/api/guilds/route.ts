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

    // 1️⃣ User Infos
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!userRes.ok) throw new Error('Discord User API Fehler');
    const userRaw = await userRes.json();
    const userId = userRaw.id;

    // DashboardUser upsert (optional)
    await prisma.dashboardUser.upsert({
      where: { discordId: userId },
      update: { username: userRaw.username, avatar: userRaw.avatar ?? null },
      create: { discordId: userId, username: userRaw.username, avatar: userRaw.avatar ?? null },
    });

    // 2️⃣ Alle User-Guilds abrufen
    const guildsRes = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!guildsRes.ok) throw new Error('Discord Guilds API Fehler');
    const userGuilds = await guildsRes.json();

    const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
    if (!BOT_TOKEN) throw new Error('BOT_TOKEN fehlt');

    const result: { id: string; name: string; icon?: string; role: RoleType }[] = [];

    // 3️⃣ Filter: Nur Server, wo Bot ist
    for (const g of userGuilds) {
      // Bot prüfen
      const botRes = await fetch(`https://discord.com/api/guilds/${g.id}/members/@me`, {
        headers: { Authorization: `Bot ${BOT_TOKEN}` },
      });
      if (!botRes.ok) continue; // Bot ist nicht auf diesem Server

      let role: RoleType | null = null;

      // OWNER live prüfen
      if (g.owner) role = 'OWNER';
      else {
        // CO_OWNER / PARTNER aus Prisma
        const dbRole = await prisma.serverUser.findUnique({
          where: { serverId_userId: { serverId: g.id, userId } },
        });
        if (dbRole && ['CO_OWNER', 'PARTNER'].includes(dbRole.role)) {
          role = dbRole.role as RoleType;
        }
      }

      if (role) {
        result.push({ id: g.id, name: g.name, icon: g.icon, role });
      }
    }

    // 4️⃣ Sortieren nach Rolle: OWNER > CO_OWNER > PARTNER
    const priority: Record<RoleType, number> = { OWNER: 0, CO_OWNER: 1, PARTNER: 2 };
    result.sort((a, b) => priority[a.role] - priority[b.role]);

    return NextResponse.json({ guilds: result });
  } catch (err: any) {
    console.error('Server Route Fehler:', err);
    return NextResponse.json({ error: err.message || 'Serverfehler' }, { status: 500 });
  }
}
