import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

const CRYPTIX_ID = "1462891063202156807"

async function getDiscordUser(req: Request) {
  const cookie = req.headers.get("cookie") || ""
  const token = cookie.split("admin_token=")[1]?.split(";")[0]
  if (!token) return null
  const res = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) return null
  return res.json()
}

export async function POST(req: Request) {
  const user = await getDiscordUser(req)
  if (!user) return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 })
  if (user.id !== CRYPTIX_ID) return NextResponse.json({ error: "Kein Zugriff" }, { status: 403 })

  const { ticketId } = await req.json()
  if (!ticketId) return NextResponse.json({ error: "Fehlende Daten" }, { status: 400 })

  const ticket = await prisma.ticket.update({
    where: { id: ticketId },
    data: { status: "CLOSED", closedAt: new Date() }
  })

  return NextResponse.json({ success: true, ticket })
}
