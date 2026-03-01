// src/app/api/guilds/route.ts

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('discord_token')?.value;

    if (!accessToken) {
      return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 });
    }

    // 🔹 User Guilds holen
    const guildsRes = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!guildsRes.ok) {
      return NextResponse.json({ error: 'Fehler beim Laden der Server' }, { status: 500 });
    }

    const guilds = await guildsRes.json();

    const BOT_ID = process.env.DISCORD_CLIENT_ID;

    // 🔹 Nur Server wo User Owner ist ODER Bot drin ist
    const filteredGuilds = guilds
      .filter((guild: any) => {
        const isOwner = guild.owner;
        const hasBot = (BigInt(guild.permissions) & BigInt(0x20)) === BigInt(0x20); 
        // 0x20 = MANAGE_GUILD Permission

        return isOwner || hasBot;
      })
      .map((guild: any) => ({
        id: guild.id,
        name: guild.name,
        icon: guild.icon,
        owner: guild.owner,
      }));

    return NextResponse.json(filteredGuilds);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
