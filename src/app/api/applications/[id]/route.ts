import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: any) {
  const body = await req.json();

  // status: claimed | accepted | rejected
  // reason?, comment?
  return NextResponse.json({ success: true });
}
