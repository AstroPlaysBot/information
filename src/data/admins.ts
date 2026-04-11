import prisma from "@/lib/prisma";

const CRYPTIX_ID = "1462891063202156807";

/**
 * Prüft ob User Zugriff auf AdminBoard hat
 */
export async function isAdmin(userId: string | undefined | null) {
  if (!userId) return false;

  // 👑 Cryptix hat IMMER Zugriff
  if (userId === CRYPTIX_ID) return true;

  // 🗄️ DB Check
  const member = await prisma.adminBoardMember.findUnique({
    where: { discordId: userId }
  });

  return !!member;
}
