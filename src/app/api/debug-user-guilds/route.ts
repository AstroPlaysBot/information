// Temporäre Debug-Route für Serveranzeige
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    // Discord-ID per Query übergeben, z.B. ?discordId=123456
    const url = new URL(req.url);
    const discordId = url.searchParams.get('discordId');
    if (!discordId) return NextResponse.json({ error: 'discordId fehlt' }, { status: 400 });

    // 1️⃣ Alle Server, bei denen der Bot drin ist
    const botServers = await prisma.server.findMany({
      where: { botJoined: true },
    });

    // 2️⃣ Alle Server, auf denen der User CO_OWNER/Partner ist
    const userRoles = await prisma.serverUser.findMany({
      where: { userId: discordId, role: { in: ['CO_OWNER', 'PARTNER'] } },
      include: { server: true },
    });

    // 3️⃣ Owner-Server aus DB (über Server.owner_id optional)
    //    Wenn du Owner dynamisch aus Discord holen willst, einfach Owner-Check ergänzen
    const ownerServers = await prisma.server.findMany({
      where: { owner_id: discordId, botJoined: true },
    });

    // 4️⃣ Kombinieren und Rolle setzen
    const combined = [
      ...ownerServers.map(s => ({ id: s.id, name: s.name, role: 'OWNER', botJoined: s.botJoined })),
      ...userRoles.map(r => ({ id: r.server.id, name: r.server.name, role: r.role, botJoined: r.server.botJoined })),
    ];

    return NextResponse.json({
      discordId,
      botServersCount: botServers.length,
      ownerServersCount: ownerServers.length,
      userRolesCount: userRoles.length,
      visibleServers: combined,
    });
  } catch (err: any) {
    console.error('Debug Route Fehler:', err);
    return NextResponse.json({ error: err.message || 'Serverfehler' }, { status: 500 });
  }
}
