import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {

  const body = await req.json();

  const app = await prisma.application.findUnique({
    where:{id:body.id}
  })

  if(!app){
    return NextResponse.json({error:"Application not found"})
  }

  const notes: Prisma.JsonArray = Array.isArray(app.notes) ? app.notes : []

  const newNote = {
    text: body.note,
    author: "Admin",
    date: new Date().toISOString() // <- hier als String speichern
  }

  notes.push(newNote)

  await prisma.application.update({
    where:{id:body.id},
    data:{notes}
  })

  return NextResponse.json({success:true})

}
