import { cookies } from "next/headers";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import HeroSection from "@/components/common/HeroSection";
import CoursesSection from "@/components/common/CoursesSection";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export default async function StudentCoursesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const role = cookieStore.get("user_role")?.value;
  const isLoggedIn = !!token;

  // Lấy tổng số lượng khóa học từ DB để hiển thị vào Hero Section
  const dbPath = path.join(process.cwd(), "db.json");
  const fileData = await fs.readFile(dbPath, "utf8");
  const db = JSON.parse(fileData);
  const totalCourses = db.courses?.length || 0;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <Header isLoggedIn={isLoggedIn} role={role} />

      {/* Gọi HeroSection với variant="courses" và dữ liệu thật */}
      <HeroSection
        variant="courses"
        title="Các bộ đề thi"
        subtitle={`Hiện tại, chúng tôi có đề thi cho ${totalCourses} môn học`}
      />

      <CoursesSection
        showExploreButton={false}
        showFiltersAndPagination={true}
      />

      <Footer />
    </div>
  );
}
