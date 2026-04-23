import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

const DEFAULT_GAMES = {
  Minecraft:            true,
  Fortnite:             true,
  "GTA V":              true,
  "League of Legends":  true,
  Valorant:             true,
  "Rocket League":      true,
  "Apex Legends":       true,
  "Destiny 2":          true,
}

const DEFAULT_DISCOUNTS = {}

// ── GET ────────────────────────────────────────────────────────────────────
export async function GET() {
  let settings = await prisma.availabilitySettings.findUnique({
    where: { id: 1 },
  })

  if (!settings) {
    settings = await prisma.availabilitySettings.create({
      data: {
        id:        1,
        premium:   true,
        games:     DEFAULT_GAMES,
        discounts: DEFAULT_DISCOUNTS,
      },
    })
  }

  // Sicherstellen dass discounts immer im Response vorhanden ist
  // (für ältere DB-Einträge die discounts noch nicht haben)
  return NextResponse.json({
    ...settings,
    discounts: (settings as any).discounts ?? DEFAULT_DISCOUNTS,
  })
}

// ── POST ───────────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  const body = await req.json()

  // Validierung: discountProzente müssen zwischen 1–99 liegen (oder gar nicht gesetzt)
  const rawDiscounts = body.discounts ?? {}
  const sanitizedDiscounts: Record<string, any> = {}

  if (typeof rawDiscounts.premium === "number") {
    const pct = Math.round(rawDiscounts.premium)
    if (pct >= 1 && pct <= 99) sanitizedDiscounts.premium = pct
  }

  if (rawDiscounts.games && typeof rawDiscounts.games === "object") {
    const sanitizedGames: Record<string, number> = {}
    for (const [name, pct] of Object.entries(rawDiscounts.games)) {
      const rounded = Math.round(pct as number)
      if (rounded >= 1 && rounded <= 99) sanitizedGames[name] = rounded
    }
    if (Object.keys(sanitizedGames).length > 0) {
      sanitizedDiscounts.games = sanitizedGames
    }
  }

  const updated = await prisma.availabilitySettings.upsert({
    where:  { id: 1 },
    update: {
      premium:   body.premium,
      games:     body.games,
      discounts: sanitizedDiscounts,
    },
    create: {
      id:        1,
      premium:   body.premium   ?? true,
      games:     body.games     ?? DEFAULT_GAMES,
      discounts: sanitizedDiscounts,
    },
  })

  return NextResponse.json({
    ...updated,
    discounts: (updated as any).discounts ?? DEFAULT_DISCOUNTS,
  })
}
