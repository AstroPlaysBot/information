import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const body = await req.json();

  const app = await prisma.application.update({
    where: { id: body.id },
    data: { status: "REJECTED" },
  });

  let mailError = null;

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Team" <${process.env.SMTP_USER}>`,
      to: app.email,
      subject: `Deine Bewerbung für ${app.role} wurde abgelehnt`,
      html: `
        <div style="font-family:sans-serif; line-height:1.5; color:#111">
          <h2 style="color:#ff3f3f;">Hallo ${app.name},</h2>
          <p>Leider wurde deine Bewerbung für <strong>${app.role}</strong> abgelehnt.</p>
          ${body.reason ? `<p><strong>Grund:</strong> ${body.reason}</p>` : ""}
          <p>Viele Grüße,<br>Team</p>
        </div>
      `,
    });
  } catch (e) {
    console.error("E-Mail Fehler:", e);
    mailError = "E-Mail konnte nicht gesendet werden!";
  }

  return NextResponse.json({ success: true, mailError });
}
