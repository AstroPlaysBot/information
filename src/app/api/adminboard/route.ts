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
    return NextResponse.json(
      { error: 'Datenbankfehler' },
      { status: 500 }
    );
  }
}
