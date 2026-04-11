import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  try {

    const { id, admin } = await req.json()

    if(!id){
      return NextResponse.json({ success:false, error:"ID fehlt" })
    }

    await prisma.application.update({
      where:{ id },
      data:{
        status:"INTERVIEW_DONE",
        interviewFinishedBy: admin || "Admin",
        interviewFinishedAt: new Date()
      }
    })

    return NextResponse.json({ success:true })

  } catch(e){
    console.error(e)
    return NextResponse.json({ success:false, error:"Serverfehler" })
  }
}
