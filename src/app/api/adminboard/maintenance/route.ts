import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth' // adjust to your auth path
import { prisma } from '@/lib/prisma'   // adjust to your prisma path

const OWNER_ID = "1462891063202156807"

// GET – alle können lesen
export async function GET() {
  try {
    const record = await prisma.maintenanceConfig.findFirst()
    return NextResponse.json({ pages: record?.pages ?? [] })
  } catch {
    return NextResponse.json({ pages: [] })
  }
}

// POST – nur Owner darf speichern
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (session?.user?.id !== OWNER_ID) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const pages = body.pages ?? []

  // Validierung server-side
  for (const p of pages) {
    if (!p.path?.trim() || !p.reason?.trim()) {
      return NextResponse.json({ error: 'Pfad und Grund sind Pflichtfelder.' }, { status: 400 })
    }
  }

  try {
    const existing = await prisma.maintenanceConfig.findFirst()
    if (existing) {
      await prisma.maintenanceConfig.update({
        where: { id: existing.id },
        data: { pages },
      })
    } else {
      await prisma.maintenanceConfig.create({ data: { pages } })
    }
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Datenbankfehler' }, { status: 500 })
  }
}
