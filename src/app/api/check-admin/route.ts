import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const envPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

  if (!password) return NextResponse.json({ isAdmin: false });

  const isAdmin = password === envPassword;
  return NextResponse.json({ isAdmin });
}
