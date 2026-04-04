import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req:Request){

  const body = await req.json()

  const app = await prisma.application.findUnique({
    where:{id:body.id}
  })

  const notes = app?.notes || []

  notes.push(body.note)

  await prisma.application.update({
    where:{id:body.id},
    data:{notes}
  })

  return NextResponse.json({success:true})

}
