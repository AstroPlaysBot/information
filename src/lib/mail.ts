import nodemailer from 'nodemailer'

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

export async function sendAutoReply(
  to: string,
  name: string | null,
  ticketId: string,
  subject: string
) {
  const transporter = getTransporter()
  await transporter.sendMail({
    from: `"AstroPlays Support" <${process.env.SMTP_USER}>`,
    to,
    subject: `[${ticketId}] Deine Anfrage wurde erhalten`,
    html: `
      <div style="font-family:sans-serif;line-height:1.6;color:#111;max-width:600px">
        <h2 style="color:#3b82f6">Hallo${name ? ` ${name}` : ''},</h2>
        <p>Deine Anfrage wurde erfolgreich erhalten und wird von unserem Team bearbeitet.</p>
        <div style="background:#f3f4f6;border-left:4px solid #3b82f6;padding:12px 16px;border-radius:4px;margin:16px 0">
          <p style="margin:0;font-size:14px;color:#6b7280">Deine Ticket-ID</p>
          <p style="margin:4px 0 0;font-size:24px;font-weight:bold;color:#111">${ticketId}</p>
        </div>
        <p>Bitte gib diese ID in zukünftigen Mails an uns an, damit wir deine Anfrage zuordnen können.</p>
        <p style="font-size:13px;color:#6b7280">Betreff deiner Anfrage: <em>${subject}</em></p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0">
        <p style="font-size:12px;color:#9ca3af">
          Bitte antworte auf diese Mail mit der Ticket-ID im Betreff um auf deine Anfrage zu antworten.<br>
          Unser Team wird sich so schnell wie möglich bei dir melden.
        </p>
        <p>Viele Grüße,<br><strong>Team AstroPlays</strong></p>
      </div>
    `,
  })
}

export async function sendStaffReply(
  to: string,
  name: string | null,
  ticketId: string,
  content: string,
  staffName: string
) {
  const transporter = getTransporter()
  await transporter.sendMail({
    from: `"AstroPlays Support" <${process.env.SMTP_USER}>`,
    to,
    subject: `[${ticketId}] Antwort von unserem Team`,
    html: `
      <div style="font-family:sans-serif;line-height:1.6;color:#111;max-width:600px">
        <h2 style="color:#3b82f6">Hallo${name ? ` ${name}` : ''},</h2>
        <p>Du hast eine neue Antwort von unserem Team zu deiner Anfrage <strong>${ticketId}</strong>:</p>
        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin:16px 0">
          <p style="margin:0;white-space:pre-wrap">${content}</p>
        </div>
        <p style="font-size:13px;color:#6b7280">Von: ${staffName}</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0">
        <p style="font-size:12px;color:#9ca3af">
          Um zu antworten, schicke eine Mail mit <strong>${ticketId}</strong> im Betreff an ${process.env.SMTP_USER}
        </p>
        <p>Viele Grüße,<br><strong>Team AstroPlays</strong></p>
      </div>
    `,
  })
}
