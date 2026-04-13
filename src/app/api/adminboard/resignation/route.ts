import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {

  const body = await req.json();

  if (!body.id) {
    return NextResponse.json({ success:false, error:"Missing data" });
  }

  // Bewerbung holen + check
  const appCheck = await prisma.application.findUnique({
    where: { id: body.id }
  });

  if(!appCheck){
    return NextResponse.json({ success:false, error:"User nicht gefunden" });
  }

  let mailError: string | null = null;

  try {

    // Status setzen
    const app = await prisma.application.update({
      where: { id: body.id },
      data: {
        status: "RESIGNED",
        updatedAt: new Date(),
        updatedBy: "Self Resignation",
        resignationReason: body.reasonType || null,
        resignationText: body.reasonText || null
      },
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const now = new Date().toLocaleString("de-DE");

    await transporter.sendMail({
      from: `"Team AstroPlays" <${process.env.SMTP_USER}>`,
      to: app.email,
      subject: "Bestätigung deiner Kündigung bei AstroPlays",
      html: `
        <div style="font-family:sans-serif; line-height:1.6; color:#111">

          <h2 style="color:#ef4444;">Hallo ${app.name},</h2>

          <p>
            deine Kündigung bei <strong>AstroPlays</strong> wurde erfolgreich eingereicht.
          </p>

          <p><strong>Zeitpunkt der Kündigung:</strong> ${now}</p>

          <hr style="margin:20px 0"/>

          <p>
            • Deine administrativen personenbezogenen Daten werden nach
            <strong>48 Stunden</strong> automatisch gelöscht.
          </p>

          <p>
            • Innerhalb dieser 48 Stunden kannst du der Kündigung widersprechen.
          </p>

          <p>
            • Nach der Kündigung erhältst du eine automatische
            <strong>Bewerbungssperre von 30 Tagen</strong>.
          </p>

          <hr style="margin:20px 0"/>

          <p><strong>Grund:</strong> ${body.reasonType || "Kein Grund angegeben"}</p>

          <p>${body.reasonText || "Kein Feedback angegeben."}</p>

          <hr style="margin:20px 0"/>

          <p style="color:#b91c1c;">
            Falls du diese Kündigung nicht selbst durchgeführt hast,
            melde dich bitte sofort beim Support.
          </p>

          <p>
            support@astroplays.de
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
    mailError = "Fehler beim Kündigungsprozess";

  }

  return NextResponse.json({
    success: true,
    mailError
  });

}
