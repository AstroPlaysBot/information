import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

const CRYPTIX_ID = "1462891063202156807"
const BADGES = ["ALLGEMEIN", "LOESCHANTRAG", "BUG", "FEATURE", "BESCHWERDE", "SONSTIGES"]

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

async function canSetBadge(discordId: string): Promise<boolean> {
  if (discordId === CRYPTIX_ID) return true
  const member = await prisma.adminBoardMember.findUnique({ where: { discordId } })
  return member?.role === "PERSONAL_MANAGER" || member?.role === "VIEWER"
}

export async function POST(req: Request) {
  const user = await getDiscordUser(req)
  if (!user) return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 })

  const { ticketId, badge } = await req.json()
  if (!ticketId || !badge) return NextResponse.json({ error: "Fehlende Daten" }, { status: 400 })
  if (!BADGES.includes(badge)) return NextResponse.json({ error: "Ungültiger Badge" }, { status: 400 })

  // Löschantrag nur für Cryptix
  if (badge === "LOESCHANTRAG" && user.id !== CRYPTIX_ID) {
    return NextResponse.json({ error: "Kein Zugriff für Löschantrag" }, { status: 403 })
  }

  const ticket = await prisma.ticket.update({
    where: { id: ticketId },
    data: { badge, status: "IN_PROGRESS" }
  })

  // Developer benachrichtigen bei BUG oder FEATURE
  if (badge === "BUG" || badge === "FEATURE") {
    const developers = await prisma.adminBoardMember.findMany({
      where: {
        status: "ACTIVE",
        position: {
          contains: "Developer",
          mode: "insensitive"
        }
      }
    })
    console.log(`Developer benachrichtigen:`, developers.map(d => d.discordName))
    // Hier kannst du später Discord-Webhook oder Mail-Benachrichtigung einbauen
  }

  return NextResponse.json({ success: true, ticket })
}
