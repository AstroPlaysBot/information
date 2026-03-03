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

    if (!accessToken) {
      return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 });
    }

    // ======================
    // Discord User laden
    // ======================
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!userRes.ok) {
      const text = await userRes.text();
      console.error('Discord User API Fehler:', userRes.status, text);
      return NextResponse.json({ error: `Discord User API Fehler: ${userRes.status}` }, { status: 500 });
    }

    const userRaw = await userRes.json();
    if (!isDiscordUser(userRaw)) throw new Error('Discord User konnte nicht geladen werden');
    const user = userRaw;
    const userId = user.id;

    // DashboardUser upsert
    await prisma.dashboardUser.upsert({
      where: { discordId: userId },
      update: { username: user.username, avatar: user.avatar ?? null },
      create: { discordId: userId, username: user.username, avatar: user.avatar ?? null },
    });

    // ======================
    // Discord Guilds laden
    // ======================
    const guildsRes = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!guildsRes.ok) {
      const text = await guildsRes.text();
      console.error('Discord Guilds API Fehler:', guildsRes.status, text);
      return NextResponse.json({ error: `Discord Guilds API Fehler: ${guildsRes.status}` }, { status: 500 });
    }

    const discordGuildsRaw: unknown = await guildsRes.json();
    if (!Array.isArray(discordGuildsRaw)) throw new Error('Discord API liefert kein Array');
    const discordGuilds: DiscordGuild[] = discordGuildsRaw.filter(isDiscordGuild);

    const BOT_ID = process.env.BOT_ID;
    const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
    if (!BOT_ID) throw new Error('BOT_ID fehlt in .env');
    if (!BOT_TOKEN) throw new Error('DISCORD_BOT_TOKEN fehlt in .env');

    const guildsWithBot: DiscordGuild[] = [];

    // ======================
    // Bot-Prüfung & Server upsert
    // ======================
    for (const g of discordGuilds) {
      try {
        if (!g.id) continue;

        const res = await fetch(`https://discord.com/api/guilds/${g.id}/members/${BOT_ID}`, {
          headers: { Authorization: `Bot ${BOT_TOKEN}` },
        });

        const botIsInServer = res.ok;

        // Server upsert
        await prisma.server.upsert({
          where: { id: g.id },
          update: { name: g.name, icon: g.icon, botJoined: botIsInServer },
          create: { id: g.id, name: g.name, icon: g.icon, botJoined: botIsInServer },
        });

        // Nur ServerUser upsert, wenn Bot auf dem Server ist
        if (botIsInServer && userId) {
          guildsWithBot.push(g);

          const role: RoleType = g.owner ? 'OWNER' : 'PARTNER';

          await prisma.serverUser.upsert({
            where: { serverId_userId: { serverId: g.id, userId } },
            update: { role },
            create: { serverId: g.id, userId, role, categories: [] },
          });
        }
      } catch (err) {
        console.error('Fehler beim Upsert für Server', g.id, err);
      }
    }

    // ======================
    // Server abrufen: nur Bot + gültige Rolle
    // ======================
    const activeServerUsers = await prisma.serverUser.findMany({
      where: {
        userId,
        role: { in: ['OWNER', 'CO_OWNER', 'PARTNER'] },
        server: { botJoined: true },
      },
      include: { server: true },
    });

    // ======================
    // Sortieren (Owner zuerst)
    // ======================
    const rolePriority = { OWNER: 0, CO_OWNER: 1, PARTNER: 2 };
    const filteredGuilds = activeServerUsers
      .map(su => ({
        id: su.server.id,
        name: su.server.name,
        icon: su.server.icon,
        role: su.role as RoleType,
      }))
      .sort((a, b) => rolePriority[a.role] - rolePriority[b.role]);

    return NextResponse.json({ guilds: filteredGuilds });
  } catch (err: any) {
    console.error('Server Route Fehler:', err);
    return NextResponse.json({ error: err.message || 'Serverfehler' }, { status: 500 });
  }
}
