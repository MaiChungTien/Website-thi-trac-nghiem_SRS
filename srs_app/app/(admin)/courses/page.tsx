import fs from "fs/promises";
import path from "path";
import type { Course } from "@/components/admin/admin-dashboard-types";
import { CoursesPageContent } from "@/components/admin/CoursesPageContent";

type DashboardData = {
  users: unknown[];
  courses: Course[];
};

async function getCourses(): Promise<Course[]> {
  try {
    const dbPath = path.join(process.cwd(), "db.json");
    const fileData = await fs.readFile(dbPath, "utf8");
    const db = JSON.parse(fileData) as Partial<DashboardData>;
    return Array.isArray(db.courses) ? db.courses : [];
  } catch {
    return [];
  }
}

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <>
      <CoursesPageContent courses={courses} />
    </>
  );
}