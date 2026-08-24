import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";

export async function PATCH(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({error:"Unauthorized"},{status:401});
  try {
    const { username, dateOfBirth, profileImage } = await req.json();
    if (!username || !dateOfBirth) return NextResponse.json({error:"Username and date of birth are required."},{status:400});
    const dob = new Date(`${dateOfBirth}T00:00:00`);
    if (Number.isNaN(dob.getTime()) || dob > new Date()) return NextResponse.json({error:"Invalid date of birth."},{status:400});
    const clash = await prisma.user.findFirst({where:{username, NOT:{id:userId}}});
    if (clash) return NextResponse.json({error:"Username is already taken."},{status:409});
    await prisma.user.update({where:{id:userId},data:{username,dateOfBirth:dob,profileImage:profileImage || null}});
    return NextResponse.json({ok:true});
  } catch { return NextResponse.json({error:"Unable to update profile."},{status:500}); }
}
