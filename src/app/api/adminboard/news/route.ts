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

// GET — alle Posts laden
export async function GET() {
  const posts = await prisma.newsPost.findMany({
    orderBy: { createdAt: "desc" }
  })
  return NextResponse.json(posts)
}

// POST — neuen Post erstellen
export async function POST(req: Request) {
  const user = await getDiscordUser(req)
  if (!user || user.id !== CRYPTIX_ID) {
    return NextResponse.json({ error: "Kein Zugriff" }, { status: 401 })
  }
  const { content } = await req.json()
  if (!content?.trim()) {
    return NextResponse.json({ error: "Kein Inhalt" }, { status: 400 })
  }
  const post = await prisma.newsPost.create({ data: { content } })
  return NextResponse.json({ success: true, post })
}

// PATCH — Post bearbeiten
export async function PATCH(req: Request) {
  const user = await getDiscordUser(req)
  if (!user || user.id !== CRYPTIX_ID) {
    return NextResponse.json({ error: "Kein Zugriff" }, { status: 401 })
  }
  const { id, content } = await req.json()
  if (!id || !content?.trim()) {
    return NextResponse.json({ error: "Fehlende Daten" }, { status: 400 })
  }
  const post = await prisma.newsPost.update({
    where: { id },
    data: { content }
  })
  return NextResponse.json({ success: true, post })
}

// DELETE — Post löschen
export async function DELETE(req: Request) {
  const user = await getDiscordUser(req)
  if (!user || user.id !== CRYPTIX_ID) {
    return NextResponse.json({ error: "Kein Zugriff" }, { status: 401 })
  }
  const { id } = await req.json()
  if (!id) {
    return NextResponse.json({ error: "Fehlende ID" }, { status: 400 })
  }
  await prisma.newsPost.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
