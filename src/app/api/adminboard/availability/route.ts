import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const settings = await prisma.availabilitySettings.findUnique({
    where: { id: 1 }
  })

  if (!settings) {
    const created = await prisma.availabilitySettings.create({
      data: {
        id: 1,
        premium: true,
        games: {
          Minecraft: true,
          Fortnite: true,
          "GTA V": true,
          "League of Legends": true,
          Valorant: true,
          "Rocket League": true,
          "Apex Legends": true,
          "Destiny 2": true
        }
      }
    })

    return NextResponse.json(created)
  }

  return NextResponse.json(settings)
}

export async function POST(req: Request) {
  const body = await req.json()

  const updated = await prisma.availabilitySettings.upsert({
    where: { id: 1 },
    update: {
      premium: body.premium,
      games: body.games
    },
    create: {
      id: 1,
      premium: body.premium,
      games: body.games
    }
  })

  return NextResponse.json(updated)
}
