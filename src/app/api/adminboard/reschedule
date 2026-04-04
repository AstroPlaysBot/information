import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {

  const body = await req.json();

  if (!body.id || !body.date || !body.place || !body.reason) {
    return NextResponse.json({ success:false, error:"Missing data" });
  }

  const interviewDate = new Date(body.date);

  try {

    // Alte Interviews in oldInterviews speichern
    const app = await prisma.application.findUnique({ where: { id: body.id } });
    if(!app) return NextResponse.json({ success:false, error:"Bewerbung nicht gefunden" });

    const oldInterviews = app.oldInterviews || [];
    if(app.interviewDate && app.interviewPlace){
      oldInterviews.push({
        date: app.interviewDate,
        place: app.interviewPlace,
        reason: body.reason
      });
    }

    // Update Interview
    await prisma.application.update({
      where: { id: body.id },
      data: {
        interviewDate,
        interviewPlace: body.place,
        oldInterviews,
        status: "INVITED",
        updatedAt: new Date(),
        updatedBy: body.admin || "Admin"
      }
    });

    // E-Mail verschicken
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
    const time = interviewDate.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });

    await transporter.sendMail({
      from: `"Team AstroPlays" <${process.env.SMTP_USER}>`,
      to: app.email,
      subject: `Verschiebung Ihres Vorstellungsgesprächs – ${app.role}`,
      html: `
        <div style="font-family:sans-serif; line-height:1.6; color:#111">

          <h2 style="color:#4f46e5;">Hallo ${app.name},</h2>

          <p>
            Ihr Vorstellungsgespräch als <strong>${app.role}</strong> wurde verschoben.
          </p>

          ${oldInterviews.length > 0 ? `
            <p>Alter Termin: ${new Date(oldInterviews[oldInterviews.length-1].date).toLocaleString()} – ${oldInterviews[oldInterviews.length-1].place}</p>
          ` : ''}

          <p><strong>Neuer Termin:</strong></p>
          <p>Datum: ${date}</p>
          <p>Uhrzeit: ${time}</p>
          <p>Ort / Sprachkanal: ${body.place}</p>
          <p>Grund: ${body.reason}</p>

          <hr style="margin:20px 0"/>

          <p>Bitte erscheine pünktlich zum neuen Termin.</p>

          <p style="margin-top:20px">
            Viele Grüße<br/>
            <strong>Team AstroPlays</strong>
          </p>

        </div>
      `,
    });

    return NextResponse.json({ success:true });

  } catch(e:any) {
    console.error("Fehler Reschedule API:", e);
    return NextResponse.json({ success:false, error:"Interner Fehler" });
  }

}
