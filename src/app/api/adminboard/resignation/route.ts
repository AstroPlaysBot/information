import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { discordId, reasonType, reasonText } = body;

    if (!discordId) {
      return NextResponse.json({ success: false, error: "Missing discordId" });
    }

    // AdminBoard Member finden
    const member = await prisma.adminBoardMember.findUnique({
      where: { discordId }
    });

    if (!member) {
      return NextResponse.json({ success: false, error: "Admin nicht gefunden" });
    }

    // Kündigung speichern
    await prisma.adminBoardResignation.create({
      data: {
        discordId,
        discordName: member.discordName,
        reasonType,
        reasonText
      }
    });

    // Admin aus AdminBoard entfernen
    await prisma.adminBoardMember.delete({
      where: { discordId }
    });

    // Email senden (nur wenn Email übergeben wurde)
    if (body.email) {

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"AdminBoard System" <${process.env.SMTP_USER}>`,
        to: body.email,
        subject: "Bestätigung deiner AdminBoard Kündigung",
        html: `
          <div style="font-family:sans-serif; line-height:1.6; color:#111">
            <h2 style="color:#7f3fff;">Hallo ${member.discordName},</h2>

            <p>deine Kündigung aus dem <strong>AdminBoard</strong> wurde erfolgreich eingereicht.</p>

            <p><strong>Kündigungsgrund:</strong> ${reasonType || "Nicht angegeben"}</p>

            <p><strong>Feedback:</strong><br>
            ${reasonText || "Kein Feedback angegeben"}
            </p>

            <br/>

            <p>
            Deine personenbezogenen Daten werden innerhalb von 
            <strong>48 Stunden</strong> gelöscht.
            </p>

            <p>
            Innerhalb dieser Zeit kannst du deine Kündigung noch widerrufen,
            indem du dich beim Team meldest.
            </p>

            <br/>

            <p>Viele Grüße<br>AdminBoard System</p>
          </div>
        `
      });

    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Resignation error:", err);

    return NextResponse.json({
      success: false,
      error: "Server error"
    });
  }
}
