// src/app/api/guilds/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import fetch from 'node-fetch';

export const dynamic = 'force-dynamic';

interface DiscordGuild {
  id: string;
  name: string;
  icon?: string;
  owner: boolean;
}

interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar?: string;
}

type RoleType = 'OWNER' | 'CO_OWNER' | 'PARTNER';

function isDiscordGuild(obj: any): obj is DiscordGuild {
  return obj && typeof obj.id === 'string' && typeof obj.name === 'string' && typeof obj.owner === 'boolean';
}

function isDiscordUser(obj: any): obj is DiscordUser {
  return obj && typeof obj.id === 'string' && typeof obj.username === 'string';
}

export async function GET() {
  try {
    const cookieStore = cookies();
    const adminToken = cookieStore.get('admin_token')?.value;
    const userToken = cookieStore.get('user_token')?.value;
    const accessToken = adminToken || userToken;

    if (!accessToken) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 });

    // ======================
    // Discord User laden
    // ======================
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!userRes.ok) throw new Error('Discord User API Fehler');

    const userRaw = await userRes.json();
    if (!isDiscordUser(userRaw)) throw new Error('Discord User konnte nicht geladen werden');
    const userId = userRaw.id;

    // DashboardUser upsert
    await prisma.dashboardUser.upsert({
      where: { discordId: userId },
      update: { username: userRaw.username, avatar: userRaw.avatar ?? null },
      create: { discordId: userId, username: userRaw.username, avatar: userRaw.avatar ?? null },
    });

    // ======================
    // Discord Guilds laden
    // ======================
    const guildsRes = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!guildsRes.ok) throw new Error('Discord Guilds API Fehler');

    const discordGuildsRaw: unknown = await guildsRes.json();
    if (!Array.isArray(discordGuildsRaw)) throw new Error('Discord API liefert kein Array');
    const discordGuilds: DiscordGuild[] = discordGuildsRaw.filter(isDiscordGuild);

    const BOT_ID = process.env.BOT_ID!;
    const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN!;
    if (!BOT_ID || !BOT_TOKEN) throw new Error('BOT_ID oder DISCORD_BOT_TOKEN fehlt');

    // ======================
    // Server upsert + BotCheck
    // ======================
    for (const g of discordGuilds) {
      try {
        const res = await fetch(`https://discord.com/api/guilds/${g.id}/members/${BOT_ID}`, {
          headers: { Authorization: `Bot ${BOT_TOKEN}` },
        });
        const botJoined = res.ok;

        await prisma.server.upsert({
          where: { id: g.id },
          update: { name: g.name, icon: g.icon, botJoined },
          create: { id: g.id, name: g.name, icon: g.icon, botJoined },
        });
      } catch (err) {
        console.error('Fehler beim Upsert für Server', g.id, err);
      }
    }

    // ======================
    // Alle relevanten Server abrufen
    // ======================
    // 1️⃣ OWNER-Server aus Discord
    const ownerServers = discordGuilds
      .filter(g => g.owner)
      .map(g => ({ id: g.id, name: g.name, icon: g.icon, role: 'OWNER' as RoleType }));

    // 2️⃣ CO_OWNER / PARTNER aus DB, nur wenn BotJoined
    const dbRoles = await prisma.serverUser.findMany({
      where: { userId, role: { in: ['CO_OWNER', 'PARTNER'] }, server: { botJoined: true } },
      include: { server: true },
    });

    const roleServers = dbRoles.map(r => ({
      id: r.server.id,
      name: r.server.name,
      icon: r.server.icon,
      role: r.role as RoleType,
    }));

    // 3️⃣ Nur Server anzeigen, bei denen Bot auf dem Server ist
    const botServers = await prisma.server.findMany({ where: { botJoined: true } });
    const botServerIds = botServers.map(s => s.id);

    const combinedGuilds = [...ownerServers, ...roleServers]
      .filter(g => botServerIds.includes(g.id))
      // 4️⃣ Sortieren nach Rolle: OWNER > CO_OWNER > PARTNER
      .sort((a, b) => {
        const priority = { OWNER: 0, CO_OWNER: 1, PARTNER: 2 };
        return priority[a.role] - priority[b.role];
      });

    return NextResponse.json({ guilds: combinedGuilds });
  } catch (err: any) {
    console.error('Server Route Fehler:', err);
    return NextResponse.json({ error: err.message || 'Serverfehler' }, { status: 500 });
  }
}
