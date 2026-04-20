import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

const CRYPTIX_ID = "1462891063202156807"

export async function GET(req: Request) {
  const cookie = req.headers.get("cookie") || ""
  const token = cookie.split("admin_token=")[1]?.split(";")[0]
  if (!token) return NextResponse.json({ canAccess: false })

  const discordRes = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!discordRes.ok) return NextResponse.json({ canAccess: false })

  const discordUser = await discordRes.json()

  if (discordUser.id === CRYPTIX_ID) return NextResponse.json({ canAccess: true })

  const access = await prisma.zentraleAccess.findUnique({
    where: { discordId: discordUser.id }
  })

  return NextResponse.json({ canAccess: access?.canAccess ?? false })
}
