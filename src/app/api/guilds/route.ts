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

type RoleType = 'OWNER' | 'CO_OWNER' | 'TEILHABER';

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

    // Discord User Guilds abrufen
    const guildsRes = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!guildsRes.ok) {
      const text = await guildsRes.text();
      return NextResponse.json({ error: `Discord API Fehler: ${text}` }, { status: 500 });
    }

    const discordGuildsRaw: unknown = await guildsRes.json();
    if (!Array.isArray(discordGuildsRaw)) throw new Error('Discord API liefert kein Array');

    const discordGuilds: DiscordGuild[] = discordGuildsRaw.filter(isDiscordGuild);

    const BOT_ID = process.env.BOT_ID;
    const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
    if (!BOT_ID) throw new Error('BOT_ID fehlt in .env');
    if (!BOT_TOKEN) throw new Error('DISCORD_BOT_TOKEN fehlt in .env');

    const guildsWithBot: DiscordGuild[] = [];

    for (const g of discordGuilds) {
      try {
        const res = await fetch(`https://discord.com/api/guilds/${g.id}/members/${BOT_ID}`, {
          headers: { Authorization: `Bot ${BOT_TOKEN}` },
        });

        if (res.ok) {
          guildsWithBot.push(g);

          // Server upsert: botJoined = true
          await prisma.server.upsert({
            where: { id: g.id },
            update: { name: g.name, icon: g.icon, botJoined: true },
            create: { id: g.id, name: g.name, icon: g.icon, botJoined: true, ownerId: g.owner ? BOT_ID : BOT_ID },
          });
        } else {
          // Bot nicht mehr auf dem Server → botJoined = false
          await prisma.server.updateMany({
            where: { id: g.id },
            data: { botJoined: false },
          });
        }
      } catch {
        // Discord-Fehler → skip
      }
    }

    // Discord User ID abrufen
    const userIdRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const userDataRaw = await userIdRes.json();
    if (!isDiscordUser(userDataRaw)) throw new Error('Discord User ID konnte nicht abgerufen werden');
    const userData: DiscordUser = userDataRaw;
    const userId = userData.id;

    // ServerUser upsert (Owner = aktueller User)
    for (const g of guildsWithBot) {
      await prisma.serverUser.upsert({
        where: { serverId_userId: { serverId: g.id, userId } },
        update: { role: 'OWNER' },
        create: { serverId: g.id, userId, role: 'OWNER', categories: [] },
      });
    }

    // Nur Server mit botJoined = true zurückgeben
    const activeServerUsers = await prisma.serverUser.findMany({
      where: {
        userId,
        server: { botJoined: true },
      },
      include: { server: true },
    });

    const filteredGuilds = activeServerUsers.map(su => ({
      id: su.server.id,
      name: su.server.name,
      icon: su.server.icon,
      role: su.role as RoleType,
    }));

    return NextResponse.json({ guilds: filteredGuilds });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || 'Serverfehler' }, { status: 500 });
  }
}
