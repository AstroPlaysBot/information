// src/app/api/adminboard/members/route.ts
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const members = await prisma.adminBoardMember.findMany({
    where: { status: "ACTIVE" },
    select: {
      discordId: true,
      discordName: true,
      position: true,
      role: true,
    }
  })
  return NextResponse.json(members)
}
