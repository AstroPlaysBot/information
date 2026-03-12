import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req:Request){

  const body = await req.json()

  await prisma.application.update({
    where:{id:body.id},
    data:{
      status:"REJECTED"
    }
  })

  return NextResponse.json({success:true})

}
