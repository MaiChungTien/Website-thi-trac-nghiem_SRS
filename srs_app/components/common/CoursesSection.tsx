// src/components/common/CoursesSection.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CourseCard from "./CourseCard";

const BRAND_DARK = "#222d65";

// Thêm Props để component linh hoạt hơn
interface CoursesSectionProps {
  apiQuery?: string; // Query gọi API (VD: "?rating=5.0&limit=4")
  showExploreButton?: boolean; // Ẩn/hiện nút "Khám phá"
}

export default function CoursesSection({ 
  apiQuery = "?limit=8", 
  showExploreButton = true 
}: CoursesSectionProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [coursesList, setCoursesList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Nối query vào URL API
        const response = await fetch(`/api/courses${apiQuery}`);
        const result = await response.json();
        // Lấy dữ liệu từ object { data, meta }
        setCoursesList(result.data || []); 
      } catch (error) {
        console.error("Lỗi tải dữ liệu courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [apiQuery]);

  return (
    <section style={{ background: "#f0f7ff", padding: "80px 0" }}>
      <div className="max-w-screen-2xl mx-auto px-6">
        <h2 className="mb-6" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: "40px", color: BRAND_DARK }}>
          Bộ đề thi
        </h2>

        {/* ... (Giữ nguyên cụm Filter tabs của bạn) ... */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {isLoading ? (
            <p className="col-span-4 text-center text-gray-500">Đang tải khóa học...</p>
          ) : coursesList.length > 0 ? (
            coursesList.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))
          ) : (
            <p className="col-span-4 text-center text-gray-500">Không tìm thấy khóa học nào.</p>
          )}
        </div>

        {/* Nút Khám phá chỉ hiện ở trang chủ, bấm vào sẽ dẫn đến /courses */}
        {showExploreButton && (
          <div className="flex justify-center">
            <button
              onClick={() => router.push("/courses")}
              className="px-10 py-4 rounded-full bg-white font-semibold transition-all hover:shadow-md"
              style={{
                border: "1px solid rgba(34,45,101,0.3)",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "20px",
                color: BRAND_DARK,
              }}
            >
              Khám phá các bộ đề
            </button>
          </div>
        )}
      </div>
    </section>
  );
}