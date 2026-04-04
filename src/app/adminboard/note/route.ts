import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Prüfen auf notwendige Felder
    if (!body.id || !body.note || !body.admin) {
      return NextResponse.json(
        { error: "Fehlende Daten: id, note oder admin" },
        { status: 400 }
      );
    }

    // Bewerbung laden
    const app = await prisma.application.findUnique({
      where: { id: body.id }
    });

    if (!app) {
      return NextResponse.json({ error: "Bewerbung nicht gefunden" }, { status: 404 });
    }

    // Aktuelle Notizen als Array, falls null
    const notes: Prisma.JsonArray = Array.isArray(app.notes) ? app.notes : [];

    // Neue Notiz erstellen
    const newNote = {
      text: body.note,
      author: body.admin,
      date: new Date().toISOString()
    };

    notes.push(newNote);

    // Update in der DB
    await prisma.application.update({
      where: { id: body.id },
      data: { notes }
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error saving note:", err);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
