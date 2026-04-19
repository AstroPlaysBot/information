import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const cookie = req.headers.get("cookie") || ""
  const token = cookie.split("admin_token=")[1]?.split(";")[0]

  if (!token) return NextResponse.json({ role: null })

  const discordRes = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${token}` }
  })

  if (!discordRes.ok) return NextResponse.json({ role: null })

  const discordUser = await discordRes.json()

  if (discordUser.id === "1462891063202156807") {
    return NextResponse.json({ role: "OWNER" })
  }

  const member = await prisma.adminBoardMember.findUnique({
    where: { discordId: discordUser.id }
  })

  return NextResponse.json({ role: member?.role || null })
}
