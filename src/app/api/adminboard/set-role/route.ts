// src/app/api/adminboard/set-role/route.ts
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { discordId, role } = await req.json()
  if (!discordId || !role) return NextResponse.json({ error: "Fehlende Daten" }, { status: 400 })

  await prisma.adminBoardMember.update({
    where: { discordId },
    data: { role }
  })

  return NextResponse.json({ success: true })
}
