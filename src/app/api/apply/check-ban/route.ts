import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { discordId } = await req.json();

  if (!discordId) {
    return NextResponse.json({ blocked: false });
  }

  const ban = await prisma.applicationBan.findUnique({
    where: { discordId }
  });

  if (!ban) {
    return NextResponse.json({ blocked: false });
  }

  const isBlocked = new Date(ban.bannedUntil).getTime() > Date.now();

  return NextResponse.json({
    blocked: isBlocked,
    until: isBlocked ? ban.bannedUntil : null
  });
}
