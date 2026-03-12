// src/app/api/adminboard/accept/route.ts
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

  // E-Mail versenden
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Team" <${process.env.SMTP_USER}>`,
      to: app.email,
      subject: `Deine Bewerbung für ${app.role} wurde angenommen!`,
      text: `Hallo ${app.name},\n\nHerzlichen Glückwunsch! Deine Bewerbung für ${app.role} wurde angenommen.\nInterview-Termin: ${new Date(body.date).toLocaleString()}\nOrt: ${body.place}\n\nViele Grüße,\nTeam`,
    });
  } catch (e) {
    console.error("E-Mail konnte nicht gesendet werden:", e);
  }

  return NextResponse.json({ success: true });
}
