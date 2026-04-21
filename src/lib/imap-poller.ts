import { ImapFlow } from 'imapflow'
import { simpleParser } from 'mailparser'
import prisma from './prisma'
import { sendAutoReply } from './mail'

function generateTicketId(): string {
  const num = Math.floor(1000 + Math.random() * 9000)
  return `APL-${num}`
}

const IGNORED_SENDERS = [
  'vercel.com',
  'noreply@',
  'no-reply@',
  'mailer-daemon',
  'postmaster@',
  'notifications@',
  'github.com',
  'automated@',
]

export async function pollGmail() {
  const client = new ImapFlow({
    host: 'imap.gmail.com',
    port: 993,
    secure: true,
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
    logger: false,
  })

  try {
    await client.connect()
    const lock = await client.getMailboxLock('INBOX')

    try {
      const messages = []
      for await (const msg of client.fetch({ seen: false }, { source: true, envelope: true })) {
        messages.push(msg)
      }

      for (const msg of messages) {
        if (!msg.source) continue
        const parsed = await simpleParser(msg.source)
        const gmailMessageId = parsed.messageId || null
        const gmailThreadId = (parsed.headers.get('thread-index') as string) || gmailMessageId || null
        const senderMail = parsed.from?.value[0]?.address || 'unbekannt'
        const senderName = parsed.from?.value[0]?.name || null
        const subject = parsed.subject || '(Kein Betreff)'
        const content = parsed.text || parsed.html || ''

        // System-Mails ignorieren
        if (IGNORED_SENDERS.some(s => senderMail.toLowerCase().includes(s))) {
          await client.messageFlagsAdd({ uid: msg.uid }, ['\\Seen'])
          continue
        }

        // Eigene Mails ignorieren (Loop-Schutz)
        if (senderMail.toLowerCase() === process.env.SMTP_USER?.toLowerCase()) {
          await client.messageFlagsAdd({ uid: msg.uid }, ['\\Seen'])
          continue
        }

        // Deduplizierung
        if (gmailMessageId) {
          const exists = await prisma.ticketMessage.findFirst({
            where: { gmailMessageId }
          })
          if (exists) {
            await client.messageFlagsAdd({ uid: msg.uid }, ['\\Seen'])
            continue
          }
        }

        // Prüfe ob Antwort auf bestehendes Ticket
        const ticketIdMatch = subject.match(/APL-\d{4}/i)
        const existingTicket = ticketIdMatch
          ? await prisma.ticket.findUnique({ where: { ticketId: ticketIdMatch[0].toUpperCase() } })
          : null

        if (existingTicket) {
          await prisma.ticketMessage.create({
            data: {
              ticketId: existingTicket.id,
              content: typeof content === 'string' ? content : '',
              fromMail: senderMail,
              fromName: senderName,
              isStaff: false,
              gmailMessageId,
            }
          })
          await prisma.ticket.update({
            where: { id: existingTicket.id },
            data: { status: 'OPEN', updatedAt: new Date() }
          })
        } else {
          let ticketId = generateTicketId()
          while (await prisma.ticket.findUnique({ where: { ticketId } })) {
            ticketId = generateTicketId()
          }

          await prisma.ticket.create({
            data: {
              ticketId,
              senderMail,
              senderName,
              subject,
              gmailThreadId,
              status: 'OPEN',
              messages: {
                create: {
                  content: typeof content === 'string' ? content : '',
                  fromMail: senderMail,
                  fromName: senderName,
                  isStaff: false,
                  gmailMessageId,
                }
              }
            }
          })

          await sendAutoReply(senderMail, senderName, ticketId, subject)
        }

        await client.messageFlagsAdd({ uid: msg.uid }, ['\\Seen'])
      }
    } finally {
      lock.release()
    }

    await client.logout()
  } catch (err) {
    console.error('IMAP Polling Fehler:', err)
  }
}
