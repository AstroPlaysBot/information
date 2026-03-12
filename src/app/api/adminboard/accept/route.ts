import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const body = await req.json();

  const app = await prisma.application.update({
    where: { id: body.id },
    data: {
      status: "ACCEPTED",
      interviewDate: new Date(body.date),
      interviewPlace: body.place,
    },
  });

  let mailError = null;

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // STARTTLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Team" <${process.env.SMTP_USER}>`,
      to: app.email,
      subject: `Deine Bewerbung für ${app.role} wurde angenommen!`,
      html: `
        <div style="font-family:sans-serif; line-height:1.5; color:#111">
          <h2 style="color:#7f3fff;">Herzlichen Glückwunsch, ${app.name}!</h2>
          <p>Deine Bewerbung für <strong>${app.role}</strong> wurde angenommen.</p>
          <p><strong>Interview-Termin:</strong> ${new Date(body.date).toLocaleString()}</p>
          <p><strong>Ort:</strong> ${body.place}</p>
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
