import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.id || !body.note || !body.admin) {
      return NextResponse.json(
        { error: "Fehlende Daten: id, note oder admin" },
        { status: 400 }
      );
    }

    const app = await prisma.application.findUnique({
      where: { id: body.id }
    });

    if (!app) {
      return NextResponse.json(
        { error: "Bewerbung nicht gefunden" },
        { status: 404 }
      );
    }

    // ✅ safe cast
    const notes = Array.isArray(app.notes) ? app.notes : [];

    const newNote = {
      text: body.note,
      author: body.admin,
      date: new Date().toISOString()
    };

    await prisma.application.update({
      where: { id: body.id },
      data: {
        notes: [...notes, newNote]
      }
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Error saving note:", err);

    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}
