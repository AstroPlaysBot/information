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

type RoleType = 'OWNER' | 'COOWNER' | 'TEILHABER';

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

    // 🔹 Rollen aus DB abrufen
    const userIdRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const userDataRaw: unknown = await userIdRes.json();

    // Typensicherheit: prüfen, dass id existiert
    if (
      typeof userDataRaw !== 'object' ||
      userDataRaw === null ||
      !('id' in userDataRaw)
    ) {
      throw new Error('Discord User Data ungültig');
    }

    const userData = userDataRaw as DiscordUser;
    const userId = userData.id;
    if (!userId) throw new Error('Discord User ID konnte nicht abgerufen werden');

    const guildRoles = await prisma.guildUser.findMany({
      where: {
        userId,
        guildId: { in: guildsWithBot.map((g) => g.id) },
      },
    });

    const filteredGuilds = guildsWithBot
      .map((g) => {
        const roleEntry = guildRoles.find((r) => r.guildId === g.id);
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
