import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { cookies } from "next/headers";

export async function POST(req: Request) {

  const body = await req.json();

  const cookieStore = cookies();
  const discordId = cookieStore.get("discord_id")?.value;

  if (!discordId) {
    return NextResponse.json({ success:false, error:"Nicht eingeloggt" });
  }

  try {

    const app = await prisma.application.findFirst({
      where: { discordId }
    });

    if(!app){
      return NextResponse.json({ success:false, error:"User nicht gefunden" });
    }

    // Optional Feedback speichern
    await prisma.application.update({
      where: { id: app.id },
      data: {
        status: "RESIGNED",
        updatedAt: new Date(),
        updatedBy: "Self Resignation",
        resignationReason: body.reasonType || null,
        resignationText: body.reasonText || null
      }
    });

    // Mail Transporter
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

          <h3>Wichtige Informationen</h3>

          <p>
            • Deine administrativen personenbezogenen Daten werden nach
            <strong>48 Stunden</strong> automatisch gelöscht.
          </p>

          <p>
            • Innerhalb dieser 48 Stunden kannst du der Kündigung widersprechen
            und wieder im Team aktiviert werden.
          </p>

          <p>
            • Nach der Kündigung erhältst du eine automatische
            <strong>Bewerbungssperre von 30 Tagen</strong>.
          </p>

          <hr style="margin:20px 0"/>

          <h3>Dein Feedback</h3>

          <p><strong>Grund:</strong> ${body.reasonType || "Kein Grund angegeben"}</p>

          <p>
            ${body.reasonText || "Kein zusätzliches Feedback angegeben."}
          </p>

          <hr style="margin:20px 0"/>

          <p style="color:#b91c1c;">
            Falls du diese Kündigung <strong>nicht selbst durchgeführt</strong> hast,
            wende dich bitte sofort an unseren Support.
          </p>

          <p>
            Support Kontakt:<br/>
            <strong>support@astroplays.de</strong>
          </p>

          <p style="margin-top:25px">
            Vielen Dank für deine Mitarbeit im Team.
          </p>

          <p>
            Viele Grüße<br/>
            <strong>Team AstroPlays</strong>
          </p>

        </div>
      `,
    });

    return NextResponse.json({ success:true });

  } catch(e:any) {

    console.error("Fehler Resignation API:", e);

    return NextResponse.json({
      success:false,
      error:"Interner Fehler"
    });
  }

}
