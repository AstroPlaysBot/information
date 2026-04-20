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

// GET — alle Zentrale-Zugänge laden
export async function GET(req: Request) {
  const user = await getDiscordUser(req)
  if (!user || user.id !== CRYPTIX_ID) {
    return NextResponse.json({ error: "Kein Zugriff" }, { status: 403 })
  }

  // Alle aktiven Members die Moderator, Frontend oder Backend sind
  const members = await prisma.adminBoardMember.findMany({
    where: {
      status: "ACTIVE",
      OR: [
        { position: { contains: "Moderator", mode: "insensitive" } },
        { position: { contains: "Developer", mode: "insensitive" } },
      ]
    }
  })

  // Für jeden Member prüfen ob Zentrale-Zugang existiert
  const accessList = await prisma.zentraleAccess.findMany()
  const accessMap = new Map(accessList.map(a => [a.discordId, a.canAccess]))

  return NextResponse.json(members.map(m => ({
    discordId: m.discordId,
    discordName: m.discordName,
    position: m.position,
    canAccess: accessMap.get(m.discordId) ?? false
  })))
}

// POST — Zugang setzen
export async function POST(req: Request) {
  const user = await getDiscordUser(req)
  if (!user || user.id !== CRYPTIX_ID) {
    return NextResponse.json({ error: "Kein Zugriff" }, { status: 403 })
  }

  const { discordId, discordName, canAccess } = await req.json()
  if (!discordId) return NextResponse.json({ error: "Fehlende Daten" }, { status: 400 })

  await prisma.zentraleAccess.upsert({
    where: { discordId },
    update: { canAccess },
    create: { discordId, discordName, canAccess }
  })

  return NextResponse.json({ success: true })
}
