import { getCurrentUser } from "@/lib/current-user";
import DashboardClient, { DashboardData } from "./DashboardClient";
import { Goal } from "./goals/GoalsClient";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const goals = Array.isArray(user.goals) ? (user.goals as unknown as Goal[]) : [];

  const dashboardUser: DashboardData = {
    id: user.id,
    username: user.username,
    dateOfBirth: user.dateOfBirth.toISOString(),
    profileImage: user.profileImage,
    screenTimeMinutes: user.screenTimeMinutes,
    sleepHours: user.sleepHours,
    goals,
  };

  return <DashboardClient user={dashboardUser} />;
}
