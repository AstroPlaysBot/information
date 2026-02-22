import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

// Type für globalThis erweitern
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// prisma global oder neu
const prisma = globalThis.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();

  try {
    const applications = await prisma.application.findMany({
      orderBy: { submittedAt: 'desc' },
    });

    res.status(200).json({ applications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Datenbankfehler', details: err instanceof Error ? err.message : err });
  }
}
