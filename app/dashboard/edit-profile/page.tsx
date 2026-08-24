import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";
import EditProfileClient from "./EditProfileClient";

export default async function EditProfilePage() {
  const id=await getSessionUserId();
  if(!id) redirect("/login");
  const user=await prisma.user.findUnique({where:{id}});
  if(!user) redirect("/login");
  return <EditProfileClient user={{username:user.username,dateOfBirth:user.dateOfBirth.toISOString().slice(0,10),profileImage:user.profileImage}}/>;
}
