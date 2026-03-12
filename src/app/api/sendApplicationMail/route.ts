import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();

  // Speichere die Bewerbung in der DB
  const application = await prisma.application.create({
    data: {
      name: body.name,
      role: body.role,
      age: body.age,
      email: body.email,
      discord_id: body.discordId,
      discriminator: body.discriminator,
      avatar: body.avatar,
      account_created: body.accountCreated ? new Date(body.accountCreated) : null,
      answers: body.answers ?? {},
      status: "PENDING",
      deleted: false,
    },
  });

  // Mail versenden
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const answersHtml = Object.entries(body.answers)
      .map(([question, answer]) => `<tr><td style="padding:5px;font-weight:bold">${question}</td><td style="padding:5px">${answer}</td></tr>`)
      .join("");

    await transporter.sendMail({
      from: `"Team" <${process.env.SMTP_USER}>`,
      to: body.email,
      subject: `Deine Bewerbung für ${body.role} wurde eingereicht!`,
      html: `
        <div style="font-family:sans-serif; line-height:1.5; color:#111">
          <h2 style="color:#7f3fff;">Hallo ${body.name},</h2>
          <p>Vielen Dank für deine Bewerbung als <strong>${body.role}</strong>! Hier ist eine Zusammenfassung deiner Angaben:</p>
          <table style="border-collapse: collapse; width:100%; max-width:600px;">
            <tr><td style="padding:5px;font-weight:bold">Alter</td><td style="padding:5px">${body.age}</td></tr>
            <tr><td style="padding:5px;font-weight:bold">Discord</td><td style="padding:5px">${body.name}#${body.discriminator}</td></tr>
            ${answersHtml}
          </table>
          <p>Wir melden uns bei dir, sobald es Neuigkeiten gibt.</p>
          <p>Viele Grüße,<br>Team</p>
        </div>
      `,
    });

  } catch (e) {
    console.error("Fehler beim Senden der Bewerbungs-Mail:", e);
    return NextResponse.json({ success: false, error: "Mail konnte nicht gesendet werden" });
  }

  return NextResponse.json({ success: true, application });
}
