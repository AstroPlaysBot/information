import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { discordId } = await req.json()

  const ban = await prisma.applicationBan.findUnique({
    where: { discordId }
  })

  if (!ban) {
    return NextResponse.json({ blocked: false })
  }

  if (new Date(ban.bannedUntil) > new Date()) {
    return NextResponse.json({
      blocked: true,
      until: ban.bannedUntil
    })
  }

  return NextResponse.json({ blocked: false })
}
