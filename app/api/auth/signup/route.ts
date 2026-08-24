import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { username, password, dateOfBirth } = await req.json();
    if (!username || !password || !dateOfBirth) return NextResponse.json({error:"All fields are required."},{status:400});
    if (password.length < 6) return NextResponse.json({error:"Password must be at least 6 characters."},{status:400});
    const dob = new Date(`${dateOfBirth}T00:00:00`);
    if (Number.isNaN(dob.getTime()) || dob > new Date()) return NextResponse.json({error:"Enter a valid date of birth."},{status:400});
    const exists = await prisma.user.findUnique({where:{username}});
    if (exists) return NextResponse.json({error:"Username is already taken."},{status:409});
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({data:{username, passwordHash, dateOfBirth:dob}});
    await createSession(user.id);
    return NextResponse.json({ok:true});
  } catch { return NextResponse.json({error:"Unable to create account."},{status:500}); }
}
