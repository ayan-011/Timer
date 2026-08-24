import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";

const periods = new Set(["day", "week", "month", "year"]);

export async function PATCH(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { goals } = await req.json();

    if (!Array.isArray(goals) || goals.length > 100) {
      return NextResponse.json({ error: "Invalid goals." }, { status: 400 });
    }

    const clean = goals.map((item) => ({
      id: String(item.id),
      period: String(item.period),
      goal: String(item.goal).trim().slice(0, 1000),
      achieved: String(item.achieved || "").trim().slice(0, 2000),
      createdAt: String(item.createdAt)
    }));

    if (clean.some((item) => !periods.has(item.period) || !item.goal)) {
      return NextResponse.json({ error: "Every goal needs a valid time period and description." }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { goals: clean }
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to save goals." }, { status: 500 });
  }
}
