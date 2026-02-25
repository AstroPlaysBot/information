// app/api/adminboard/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { adminAuth } from '@/middleware/adminAuth';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const auth = await adminAuth(req);
  if (auth) return auth;

  const applications = await prisma.application.findMany({
    orderBy: { submittedAt: 'desc' },
  });

  return NextResponse.json({ applications });
}

export async function POST(req: Request) {
  const auth = await adminAuth(req);
  if (auth) return auth;

  const data = await req.json();

  const created = await prisma.application.create({
    data: {
      id: crypto.randomUUID(),
      name: data.name,
      age: data.age || null,
      email: data.email || null,
      role: data.role,
      answers: data.answers || {},
      submittedAt: new Date(),
    },
  });

  return NextResponse.json({ success: true, application: created });
}
