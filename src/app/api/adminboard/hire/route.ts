import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {

  const body = await req.json();

  const app = await prisma.application.update({
    where: { id: body.id },
    data: {
      status: "ACCEPTED"
    }
  });

  let mailError: string | null = null;

  try {

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: `"Team AstroPlays" <${process.env.SMTP_USER}>`,
      to: app.email,
      subject: `Du wurdest als ${app.role} angenommen!`,
      html: `
      <div style="font-family:sans-serif; line-height:1.6; color:#111">

        <h2 style="color:#7c3aed">Willkommen im Team, ${app.name}!</h2>

        <p>
        Wir freuen uns dir mitteilen zu können, dass du nach deinem
        Vorstellungsgespräch als <strong>${app.role}</strong>
        angenommen wurdest.
        </p>

        <h3>AdminBoard Zugriff</h3>

        <p>
        Du hast nun Zugriff auf unser internes AdminBoard.
        Dort kannst du Bewerbungen verwalten und Teamaufgaben übernehmen.
        </p>

        <h3>Beginn deiner Arbeit</h3>

        <p>
        Bitte melde dich bei ... um eine Einführung zu erhalten.
        Anschließend erhälst du erste Aufgaben und hast 3 Tage Zeit dich einzufinden.

        Solltest du erkranken, ausfallen oder beurlaubt sein, melde dies bitte unverzüglich deinem Ansprechpartner.
        </p>
        
        <p>
        Falls du Fragen hast, melde dich jederzeit bei uns.
        </p>

        <br/>

        <p>
        Viele Grüße<br/>
        <strong>Team AstroPlays</strong>
        </p>

      </div>
      `
    });

  } catch (e:any) {

    console.error("Mail Fehler:", e);
    mailError = "Mail konnte nicht gesendet werden";

  }

  return NextResponse.json({
    success: true,
    mailError
  });

}
