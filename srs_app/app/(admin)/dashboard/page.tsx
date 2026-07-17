import fs from "fs/promises";
import path from "path";
import { AdminDashboardHero } from "@/components/admin/AdminDashboardHero";
import { ManagerAccessSection } from "@/components/admin/ManagerAccessSection";
import type { Course } from "@/components/admin/admin-dashboard-types";

type DashboardData = {
  users: unknown[];
  courses: Course[];
};

async function getDashboardData(): Promise<DashboardData> {
  try {
    const dbPath = path.join(process.cwd(), "db.json");
    const fileData = await fs.readFile(dbPath, "utf8");
    const db = JSON.parse(fileData) as Partial<DashboardData>;

    return {
      users: Array.isArray(db.users) ? db.users : [],
      courses: Array.isArray(db.courses) ? db.courses : [],
    };
  } catch {
    return { users: [], courses: [] };
  }
}

export default async function AdminDashboardPage() {
  const { users } = await getDashboardData();

  return (
    <>
      <AdminDashboardHero />
      <ManagerAccessSection userCount={users.length} />
    </>
  );
}