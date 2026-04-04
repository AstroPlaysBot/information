import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  const body = await req.json();

  const app = await prisma.application.findUnique({
    where: { id: body.id },
  });

  if (!app) {
    return NextResponse.json(
      { success: false, error: "Application not found" },
      { status: 404 }
    );
  }

  // Sicherstellen, dass notes ein Array ist
  const notes: Prisma.JsonArray = Array.isArray(app.notes) ? app.notes : [];

  notes.push(body.note);

  await prisma.application.update({
    where: { id: body.id },
    data: { notes },
  });

  return NextResponse.json({ success: true });
}
