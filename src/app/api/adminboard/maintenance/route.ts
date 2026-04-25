import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

const OWNER_ID = "1462891063202156807";
const DISCORD_USER_URL = 'https://discord.com/api/users/@me';

async function getDiscordId(token: string): Promise<string | null> {
  try {
    const res = await fetch(DISCORD_USER_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const user = await res.json();
    return user?.id ?? null;
  } catch {
    return null;
  }
}

// GET – alle können lesen
export async function GET() {
  try {
    const record = await prisma.maintenanceConfig.findFirst();
    return NextResponse.json({ pages: record?.pages ?? [] });
  } catch {
    return NextResponse.json({ pages: [] });
  }
}

// POST – nur du (OWNER_ID)
export async function POST(req: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const discordId = await getDiscordId(token);
  if (discordId !== OWNER_ID)
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const pages = body.pages ?? [];

  for (const p of pages) {
    if (!p.path?.trim() || !p.reason?.trim()) {
      return NextResponse.json({ error: 'Pfad und Grund sind Pflichtfelder.' }, { status: 400 });
    }
  }

  try {
    const existing = await prisma.maintenanceConfig.findFirst();
    if (existing) {
      await prisma.maintenanceConfig.update({
        where: { id: existing.id },
        data: { pages },
      });
    } else {
      await prisma.maintenanceConfig.create({ data: { pages } });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Datenbankfehler' }, { status: 500 });
  }
}
