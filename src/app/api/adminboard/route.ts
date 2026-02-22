import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const applications = await prisma.application.findMany({
      orderBy: {
        submittedAt: 'desc',
      },
    });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error('ADMINBOARD ERROR:', error);
    return NextResponse.json({ error: 'Datenbankfehler' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const created = await prisma.application.create({
      data: {
        id: crypto.randomUUID(),
        name: data.name,
        age: data.age,
        email: data.email,
        role: data.role,          // z.B. 'Beta Tester'
        answers: data.answers,    // JSON-Objekt
        answers: data.answers || {},
        submittedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, application: created });
  } catch (error) {
    console.error('ADMINBOARD POST ERROR:', error);
    return NextResponse.json({ success: false, error: 'Speichern fehlgeschlagen' }, { status: 500 });
  }
}
