// src/app/api/guilds/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = cookies();
    const adminToken = cookieStore.get('admin_token')?.value;
    const userToken = cookieStore.get('user_token')?.value;

    const accessToken = adminToken || userToken;
    if (!accessToken) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 });

    // 🔹 User Guilds von Discord holen
    const guildsRes = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!guildsRes.ok) {
      const text = await guildsRes.text();
      return NextResponse.json({ error: `Discord API Fehler: ${text}` }, { status: 500 });
    }

    const guilds = await guildsRes.json();

    // Nur Server wo User Owner ist oder Bot drin ist
    const filteredGuilds = guilds
      .filter((g: any) => g.owner) // optional: Bot-Permission check hinzufügen
      .map((g: any) => ({
        id: g.id,
        name: g.name,
        icon: g.icon,
        owner: g.owner,
      }));

    return NextResponse.json({ guilds: filteredGuilds });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
