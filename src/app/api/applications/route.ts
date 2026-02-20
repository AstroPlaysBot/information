import { NextResponse } from 'next/server';

let applications: any[] = [];

export async function POST(req: Request) {
  const body = await req.json();
  applications.push({
    id: crypto.randomUUID(),
    status: 'open',
    comments: [],
    ...body,
  });
  return NextResponse.json({ success: true });
}

export async function GET() {
  return NextResponse.json(applications);
}
