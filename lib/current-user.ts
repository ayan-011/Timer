import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";

export async function getCurrentUser() {
  const id = await getSessionUserId();
  if (!id) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) redirect("/login");

  return user;
}
