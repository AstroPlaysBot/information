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

const baseStyle = `
  <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#1a1a1a;max-width:600px;margin:0 auto;background:#ffffff">
    <div style="background:linear-gradient(135deg,#1e293b 0%,#0f172a 100%);padding:32px 40px;border-radius:12px 12px 0 0">
      <div style="display:flex;align-items:center;gap:12px">
        <div style="width:36px;height:36px;background:#3b82f6;border-radius:8px;display:flex;align-items:center;justify-content:center">
          <span style="color:white;font-weight:bold;font-size:16px">A</span>
        </div>
        <div>
          <p style="margin:0;color:#ffffff;font-weight:700;font-size:18px">AstroPlays</p>
          <p style="margin:0;color:#94a3b8;font-size:12px">Support Center</p>
        </div>
      </div>
    </div>
    <div style="padding:32px 40px;background:#ffffff;border:1px solid #e2e8f0;border-top:none">
`

const baseEnd = `
    </div>
    <div style="padding:20px 40px;background:#f8fafc;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px">
      <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center">
        AstroPlays Support · Diese Mail wurde automatisch generiert · Bitte antworte nicht direkt auf diese Mail
      </p>
    </div>
  </div>
`

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
      ${baseStyle}
        <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0f172a">
          Hallo${name ? ` ${name}` : ''}!
        </h2>
        <p style="color:#475569;margin:0 0 24px">
          Deine Anfrage ist bei uns eingegangen. Unser Team kümmert sich so schnell wie möglich darum.
        </p>

        <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:10px;padding:20px;margin:0 0 24px">
          <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#0369a1;text-transform:uppercase;letter-spacing:0.05em">
            Deine Ticket-ID
          </p>
          <p style="margin:0;font-size:28px;font-weight:800;color:#0c4a6e;letter-spacing:0.05em">
            ${ticketId}
          </p>
          <p style="margin:8px 0 0;font-size:13px;color:#0369a1">
            Bitte gib diese ID in allen zukünftigen Mails an, damit wir deine Anfrage schnell zuordnen können.
          </p>
        </div>

        <div style="background:#f8fafc;border-radius:8px;padding:16px;margin:0 0 24px">
          <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;font-weight:600;text-transform:uppercase">Betreff</p>
          <p style="margin:0;color:#334155;font-size:14px">${subject}</p>
        </div>

        <div style="border-top:1px solid #e2e8f0;padding-top:20px;margin-top:8px">
          <p style="margin:0 0 8px;font-size:13px;color:#64748b">
            <strong style="color:#334155">So kannst du antworten:</strong> Schreibe uns eine Mail mit
            <code style="background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:12px;color:#3b82f6">${ticketId}</code>
            im Betreff.
          </p>
          <p style="margin:0;font-size:13px;color:#64748b">
            Wir melden uns in der Regel innerhalb von 24–48 Stunden.
          </p>
        </div>

        <p style="margin:24px 0 0;color:#334155">
          Viele Grüße,<br>
          <strong>Team AstroPlays</strong>
        </p>
      ${baseEnd}
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
    subject: `[${ticketId}] Antwort von unserem Support-Team`,
    html: `
      ${baseStyle}
        <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0f172a">
          Hallo${name ? ` ${name}` : ''}!
        </h2>
        <p style="color:#475569;margin:0 0 24px">
          Du hast eine neue Antwort zu deiner Support-Anfrage
          <code style="background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:13px;color:#3b82f6;font-weight:600">${ticketId}</code>
          erhalten.
        </p>

        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid #3b82f6;border-radius:0 8px 8px 0;padding:20px;margin:0 0 24px">
          <p style="margin:0 0 12px;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.05em">
            Antwort von ${staffName}
          </p>
          <p style="margin:0;color:#1e293b;font-size:15px;line-height:1.7;white-space:pre-wrap">${content}</p>
        </div>

        <div style="border-top:1px solid #e2e8f0;padding-top:20px">
          <p style="margin:0 0 8px;font-size:13px;color:#64748b">
            <strong style="color:#334155">Möchtest du antworten?</strong> Schreibe uns eine Mail mit
            <code style="background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:12px;color:#3b82f6">${ticketId}</code>
            im Betreff an
            <a href="mailto:${process.env.SMTP_USER}" style="color:#3b82f6;text-decoration:none">${process.env.SMTP_USER}</a>.
          </p>
        </div>

        <p style="margin:24px 0 0;color:#334155">
          Viele Grüße,<br>
          <strong>Team AstroPlays</strong>
        </p>
      ${baseEnd}
    `,
  })
}

export async function sendTicketClosed(
  to: string,
  name: string | null,
  ticketId: string,
  closedBy: string
) {
  const transporter = getTransporter()
  await transporter.sendMail({
    from: `"AstroPlays Support" <${process.env.SMTP_USER}>`,
    to,
    subject: `[${ticketId}] Dein Support-Ticket wurde geschlossen`,
    html: `
      ${baseStyle}
        <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0f172a">
          Hallo${name ? ` ${name}` : ''}!
        </h2>
        <p style="color:#475569;margin:0 0 24px">
          Dein Support-Ticket wurde erfolgreich abgeschlossen. Wir hoffen, dass dein Anliegen zu deiner Zufriedenheit gelöst werden konnte.
        </p>

        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:20px;margin:0 0 24px">
          <div style="display:flex;align-items:center;gap:10px;margin:0 0 12px">
            <div style="width:24px;height:24px;background:#22c55e;border-radius:50%;display:flex;align-items:center;justify-content:center">
              <span style="color:white;font-size:14px">✓</span>
            </div>
            <p style="margin:0;font-weight:700;color:#15803d;font-size:15px">Ticket geschlossen</p>
          </div>
          <div style="display:flex;gap:24px">
            <div>
              <p style="margin:0 0 2px;font-size:11px;color:#86efac;font-weight:600;text-transform:uppercase">Ticket-ID</p>
              <p style="margin:0;font-size:16px;font-weight:700;color:#14532d">${ticketId}</p>
            </div>
            <div>
              <p style="margin:0 0 2px;font-size:11px;color:#86efac;font-weight:600;text-transform:uppercase">Geschlossen von</p>
              <p style="margin:0;font-size:16px;font-weight:700;color:#14532d">${closedBy}</p>
            </div>
            <div>
              <p style="margin:0 0 2px;font-size:11px;color:#86efac;font-weight:600;text-transform:uppercase">Datum</p>
              <p style="margin:0;font-size:16px;font-weight:700;color:#14532d">${new Date().toLocaleDateString('de-DE')}</p>
            </div>
          </div>
        </div>

        <p style="color:#475569;font-size:14px;margin:0 0 24px">
          Falls du weitere Fragen hast oder dein Anliegen noch nicht vollständig gelöst wurde, kannst du jederzeit eine neue Anfrage stellen.
        </p>

        <div style="border-top:1px solid #e2e8f0;padding-top:20px">
          <p style="margin:0;font-size:13px;color:#64748b">
            Neue Anfrage stellen: Schreibe einfach eine Mail an
            <a href="mailto:${process.env.SMTP_USER}" style="color:#3b82f6;text-decoration:none">${process.env.SMTP_USER}</a>
          </p>
        </div>

        <p style="margin:24px 0 0;color:#334155">
          Viele Grüße,<br>
          <strong>Team AstroPlays</strong>
        </p>
      ${baseEnd}
    `,
  })
}
