import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { sendStaffReply } from "@/lib/mail"

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

async function canReply(discordId: string, badge: string | null): Promise<boolean> {
  if (discordId === CRYPTIX_ID) return true
  
  // Löschantrag nur Cryptix
  if (badge === "LOESCHANTRAG") return false

  const access = await prisma.zentraleAccess.findUnique({ where: { discordId } })
  return access?.canAccess ?? false
}

export async function POST(req: Request) {
  const user = await getDiscordUser(req)
  if (!user) return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 })

  const { ticketId, content } = await req.json()
  if (!ticketId || !content?.trim()) {
    return NextResponse.json({ error: "Fehlende Daten" }, { status: 400 })
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId }
  })
  if (!ticket) return NextResponse.json({ error: "Ticket nicht gefunden" }, { status: 404 })

  if (!await canReply(user.id, ticket.badge)) {
    return NextResponse.json({ error: "Kein Zugriff" }, { status: 403 })
  }

  // Nachricht speichern
  const message = await prisma.ticketMessage.create({
    data: {
      ticketId,
      content,
      fromMail: process.env.SMTP_USER!,
      fromName: user.username,
      isStaff: true,
      staffId: user.id,
      staffName: user.username,
    }
  })

  // Mail an User senden
  await sendStaffReply(
    ticket.senderMail,
    ticket.senderName,
    ticket.ticketId,
    content,
    user.username
  )

  return NextResponse.json({ success: true, message })
}
