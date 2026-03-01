// src/app/api/guilds/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = cookies();
    const userToken = cookieStore.get('user_token')?.value;
    const adminToken = cookieStore.get('admin_token')?.value;

    if (!userToken && !adminToken) {
      return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 });
    }

    const accessToken = userToken || adminToken; // Zugriff auf Discord-API

    // 🔹 User Guilds holen
    const guildsRes = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: {
        Authorization: `Bearer ${accessToken}`, // muss ein gültiger OAuth-Token sein
      },
    });

    if (!guildsRes.ok) {
      return NextResponse.json({ error: 'Fehler beim Laden der Server' }, { status: 500 });
    }

    const guilds = await guildsRes.json();

    // Filter für Owner oder Bot drin
    const filteredGuilds = guilds
      .filter((guild: any) => guild.owner) // hier kannst du Bot-Permission-Check ergänzen
      .map((guild: any) => ({
        id: guild.id,
        name: guild.name,
        icon: guild.icon,
        owner: guild.owner,
      }));

    return NextResponse.json({ guilds: filteredGuilds });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
