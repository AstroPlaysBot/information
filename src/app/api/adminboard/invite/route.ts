import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {

  const body = await req.json();

  if (!body.id || !body.date || !body.place) {
    return NextResponse.json({ success:false, error:"Missing data" });
  }

  const interviewDate = new Date(body.date);

  // Bewerbung auf Interview setzen
  const app = await prisma.application.update({
    where: { id: body.id },
    data: {
      status: "INTERVIEW",
      interviewDate,
      interviewPlace: body.place,
      updatedAt:new Date(),
      updatedBy:body.admin || "Admin"
    },
  });

  let mailError: string | null = null;

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

    const date = interviewDate.toLocaleDateString("de-DE");
    const time = interviewDate.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit"
    });

    await transporter.sendMail({
      from: `"Team AstroPlays" <${process.env.SMTP_USER}>`,
      to: app.email,
      subject: `Einladung zum Vorstellungsgespräch – ${app.role}`,
      html: `
        <div style="font-family:sans-serif; line-height:1.6; color:#111">

          <h2 style="color:#4f46e5;">Hallo ${app.name},</h2>

          <p>
            vielen Dank für deine Bewerbung als <strong>${app.role}</strong>.
          </p>

          <p>
            Wir möchten dich gerne zu einem kurzen
            <strong>Vorstellungsgespräch</strong> einladen.
          </p>

          <hr style="margin:20px 0"/>

          <p><strong>Datum:</strong> ${date}</p>
          <p><strong>Uhrzeit:</strong> ${time}</p>
          <p><strong>Sprachkanal:</strong> ${body.place}</p>

          <hr style="margin:20px 0"/>

          <p>
            Bitte erscheine pünktlich zum Termin im angegebenen Sprachkanal.
          </p>

          <p>
            Wir freuen uns auf das Gespräch mit dir!
          </p>

          <p style="margin-top:20px">
            Viele Grüße<br/>
            <strong>Team AstroPlays</strong>
          </p>

        </div>
      `,
    });

  } catch (e:any) {

    console.error("E-Mail Fehler:", e);
    mailError = "E-Mail konnte nicht gesendet werden!";

  }

  return NextResponse.json({
    success: true,
    mailError
  });

}
