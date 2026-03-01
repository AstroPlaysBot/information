// src/app/api/guilds/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Dein Prisma Client
import fetch from 'node-fetch'; // Falls nötig

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = cookies();
    const adminToken = cookieStore.get('admin_token')?.value;
    const userToken = cookieStore.get('user_token')?.value;

    const accessToken = adminToken || userToken;
    if (!accessToken)
      return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 });

    // 🔹 User Guilds von Discord holen
    const guildsRes = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!guildsRes.ok) {
      const text = await guildsRes.text();
      return NextResponse.json({ error: `Discord API Fehler: ${text}` }, { status: 500 });
    }

    const discordGuilds = await guildsRes.json();

    // 🔹 Prüfen welche Server Bot drauf ist
    // Hier z.B. botMemberEndpoint: /guilds/:id/member/:botId
    // Angenommen du hast BOT_ID als env
    const BOT_ID = process.env.BOT_ID;
    const guildsWithBot = [];
    for (const g of discordGuilds) {
      try {
        const res = await fetch(`https://discord.com/api/guilds/${g.id}/members/${BOT_ID}`, {
          headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
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
    const userData = await userIdRes.json();
    const userId = userData.id;

    const guildRoles = await prisma.guildUser.findMany({
      where: {
        userId: userId,
        guildId: { in: guildsWithBot.map(g => g.id) },
      },
    });

    const filteredGuilds = guildsWithBot
      .map(g => {
        const roleEntry = guildRoles.find(r => r.guildId === g.id);
        if (!roleEntry) return null; // Keine Rolle → nicht anzeigen
        return {
          id: g.id,
          name: g.name,
          icon: g.icon,
          role: roleEntry.role, // OWNER | COOWNER | TEILHABER
        };
      })
      .filter(Boolean); // null raus

    return NextResponse.json({ guilds: filteredGuilds });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
