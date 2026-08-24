import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";

export async function PATCH(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { screenTimeHours, sleepHours } = await req.json();
    const screen = Number(screenTimeHours);
    const sleep = Number(sleepHours);

    if (!Number.isFinite(screen) || screen < 0 || screen > 24) {
      return NextResponse.json({ error: "Screen time must be between 0 and 24 hours." }, { status: 400 });
    }
    if (!Number.isFinite(sleep) || sleep < 0 || sleep > 24) {
      return NextResponse.json({ error: "Sleep must be between 0 and 24 hours." }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { screenTimeMinutes: Math.round(screen * 60), sleepHours: sleep }
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to save time use." }, { status: 500 });
  }
}
