import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {

  const body = await req.json();

  if (!body.id || !body.date || !body.place) {
    return NextResponse.json({ success:false, error:"Missing data" });
  }

  const interviewDate = new Date(body.date);

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

  return NextResponse.json({ success:true });
}
