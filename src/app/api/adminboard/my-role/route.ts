import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const cookie = req.headers.get("cookie") || ""
  const token = cookie.split("admin_token=")[1]?.split(";")[0]

  if (!token) return NextResponse.json({ role: null, isBetaTester: false, discordId: null, username: null })

  const discordRes = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${token}` }
  })

  if (!discordRes.ok) return NextResponse.json({ role: null, isBetaTester: false, discordId: null, username: null })

  const discordUser = await discordRes.json()

  if (discordUser.id === "1462891063202156807") {
    return NextResponse.json({ role: "OWNER", isBetaTester: false, discordId: discordUser.id, username: discordUser.username })
  }

  const member = await prisma.adminBoardMember.findUnique({
    where: { discordId: discordUser.id }
  })

  const isBetaTester = member?.position?.toLowerCase().includes("beta tester") ?? false

  return NextResponse.json({
    role: member?.role || null,
    isBetaTester,
    discordId: discordUser.id,
    username: discordUser.username
  })
}
