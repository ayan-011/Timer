import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    const user = await prisma.user.findUnique({where:{username}});
    if (!user || !(await bcrypt.compare(password, user.passwordHash)))
      return NextResponse.json({error:"Invalid username or password."},{status:401});
    await createSession(user.id);
    return NextResponse.json({ok:true});
  } catch { return NextResponse.json({error:"Unable to log in."},{status:500}); }
}
