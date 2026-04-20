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

async function hasZentraleAccess(discordId: string): Promise<boolean> {
  if (discordId === CRYPTIX_ID) return true
  const access = await prisma.zentraleAccess.findUnique({
    where: { discordId }
  })
  return access?.canAccess ?? false
}

export async function GET(req: Request) {
  const user = await getDiscordUser(req)
  if (!user) return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 })
  if (!await hasZentraleAccess(user.id)) return NextResponse.json({ error: "Kein Zugriff" }, { status: 403 })

  const url = new URL(req.url)
  const search = url.searchParams.get("search") || ""
  const badge = url.searchParams.get("badge") || ""
  const status = url.searchParams.get("status") || ""

  const tickets = await prisma.ticket.findMany({
    where: {
      ...(search ? {
        OR: [
          { ticketId: { contains: search, mode: "insensitive" } },
          { senderMail: { contains: search, mode: "insensitive" } },
          { subject: { contains: search, mode: "insensitive" } },
        ]
      } : {}),
      ...(badge ? { badge } : {}),
      ...(status ? { status } : {}),
    },
    include: {
      messages: {
        orderBy: { createdAt: "asc" }
      }
    },
    orderBy: { updatedAt: "desc" }
  })

  return NextResponse.json(tickets)
}
