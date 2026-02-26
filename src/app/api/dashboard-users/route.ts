// src/app/api/dashboard-users/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const users = await prisma.dashboardUser.findMany();
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  try {
    const { discordId, username } = await req.json();
    if (!discordId) return NextResponse.json({ error: 'discordId fehlt' }, { status: 400 });

    const user = await prisma.dashboardUser.create({
      data: { discordId, username },
    });

    return NextResponse.json(user);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'id fehlt' }, { status: 400 });

    await prisma.dashboardUser.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
