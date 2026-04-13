import prisma from "@/lib/prisma"

export async function cleanupSystem() {
  const now = new Date()

  // ❌ Admin nach 48h löschen
  await prisma.adminExitQueue.deleteMany({
    where: { deleteAt: { lte: now } }
  })

  // ❌ Ban nach 30 Tagen löschen
  await prisma.applicationBan.deleteMany({
    where: { bannedUntil: { lte: now } }
  })
}
