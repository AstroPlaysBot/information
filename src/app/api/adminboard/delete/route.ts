import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req:Request){

  const body = await req.json()

  await prisma.application.update({
    where:{id:body.id},
    data:{
      deleted:true,
      deletedAt:new Date()
    }
  })

  return NextResponse.json({success:true})

}
