import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) return NextResponse.redirect("/");

  const resignation = await prisma.adminBoardResignation.findUnique({
    where: { revokeToken: token }
  });

  if (!resignation || resignation.revoked) {
    return NextResponse.redirect("/");
  }

  await prisma.adminBoardMember.update({
    where: { discordId: resignation.discordId },
    data: {
      status: "ACTIVE",
      resignedAt: null
    }
  });

  await prisma.adminBoardResignation.update({
    where: { id: resignation.id },
    data: {
      revoked: true
    }
  });

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_APP_URL}/resignation-restored`
  );
}
