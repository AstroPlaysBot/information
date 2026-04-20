import { NextResponse } from 'next/server'
import { pollGmail } from '@/lib/imap-poller'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  // Sicherheit: nur mit Secret Key aufrufbar
  const url = new URL(req.url)
  const secret = url.searchParams.get('secret')
  if (secret !== process.env.POLL_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await pollGmail()
  return NextResponse.json({ success: true, polledAt: new Date().toISOString() })
}
