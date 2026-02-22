import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Prüfen, dass Pflichtfelder vorhanden sind
    if (!data.name || !data.role || !data.answers || Object.keys(data.answers).length === 0) {
      return NextResponse.json(
        { success: false, error: 'Pflichtfelder fehlen' },
        { status: 400 }
      );
    }

    // Bewerbungsdatensatz erstellen
    const created = await prisma.application.create({
      data: {
        id: crypto.randomUUID(),       // eindeutige ID
        name: data.name,
        age: data.age || null,         // nullable
        email: data.email || null,     // nullable
        role: data.role,
        answers: data.answers,         // JSONB
        submittedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, application: created });
  } catch (error) {
    console.error('ADMINBOARD POST ERROR:', error);
    return NextResponse.json(
      { success: false, error: 'Speichern fehlgeschlagen' },
      { status: 500 }
    );
  }
}
