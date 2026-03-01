// src/app/api/guilds/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import fetch from 'node-fetch';

export const dynamic = 'force-dynamic';

// Typen
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

export async function GET() {
  try {
    const cookieStore = cookies();
    const adminToken = cookieStore.get('admin_token')?.value;
    const userToken = cookieStore.get('user_token')?.value;
    const accessToken = adminToken || userToken;

    if (!accessToken) {
      return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 });
    }

    // 🔹 User Guilds von Discord holen
    const guildsRes = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!guildsRes.ok) {
      const text = await guildsRes.text();
      return NextResponse.json({ error: `Discord API Fehler: ${text}` }, { status: 500 });
    }

    const discordGuildsRaw: unknown = await guildsRes.json();
    if (!Array.isArray(discordGuildsRaw)) throw new Error('Discord API liefert kein Array');

    const discordGuilds: DiscordGuild[] = discordGuildsRaw.map((g: any) => ({
      id: g.id,
      name: g.name,
      icon: g.icon,
      owner: g.owner,
    }));

    // 🔹 Prüfen welche Server Bot drauf ist
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
        if (res.ok) guildsWithBot.push(g);
      } catch {
        // Bot nicht da → skip
      }
    }

    // 🔹 Discord User ID abrufen
    const userIdRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // Cast mit Type Guard
    const userDataRaw = await userIdRes.json();
    if (!userDataRaw || typeof userDataRaw.id !== 'string') {
      throw new Error('Discord User ID konnte nicht abgerufen werden');
    }
    const userData = userDataRaw as DiscordUser;
    const userId = userData.id;

    // 🔹 Rollen aus DB abrufen (ServerUser statt guildUser)
    const guildRoles = await prisma.serverUser.findMany({
      where: {
        userId,
        serverId: { in: guildsWithBot.map((g) => g.id) },
      },
    });

    // 🔹 Filtered Guilds zurückgeben
    const filteredGuilds = guildsWithBot
      .map((g) => {
        const roleEntry = guildRoles.find((r) => r.serverId === g.id);
        if (!roleEntry) return null;
        return {
          id: g.id,
          name: g.name,
          icon: g.icon,
          role: roleEntry.role as RoleType,
        };
      })
      .filter(Boolean);

    return NextResponse.json({ guilds: filteredGuilds });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || 'Serverfehler' }, { status: 500 });
  }
}
