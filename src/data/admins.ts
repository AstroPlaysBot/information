import prisma from "@/lib/prisma";

const CRYPTIX_ID = "1462891063202156807";

export async function isAdmin(userId: string | undefined | null) {
  if (!userId) return false;

  if (userId === CRYPTIX_ID) return true;

  const member = await prisma.adminBoardMember.findUnique({
    where: { discordId: userId }
  });

  if (!member) return false;

  return member.status === "ACTIVE";
}
