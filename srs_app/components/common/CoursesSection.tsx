"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CourseCard from "./CourseCard";

const BRAND_DARK = "#222d65";

interface CoursesSectionProps {
  apiQuery?: string;
  showExploreButton?: boolean;
  showFiltersAndPagination?: boolean; 
}

export default function CoursesSection({ 
  apiQuery = "?limit=8", 
  showExploreButton = true,
  showFiltersAndPagination = false
}: CoursesSectionProps) {
  const router = useRouter();
  const [coursesList, setCoursesList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  // BỔ SUNG LỖ HỔNG: Quản lý State cho thanh Phân loại
  const [category, setCategory] = useState("all");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); 
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        let finalQuery = apiQuery;
        
        if (showFiltersAndPagination) {
          finalQuery = `?limit=8&page=${currentPage}`;
          if (debouncedSearch) {
            finalQuery += `&search=${encodeURIComponent(debouncedSearch)}`;
          }
          // BỔ SUNG LỖ HỔNG: Đẩy category vào câu lệnh gọi API
          if (category !== "all") {
            finalQuery += `&category=${category}`;
          }
        }

        const response = await fetch(`/api/courses${finalQuery}`);
        const result = await response.json();
        
        setCoursesList(result.data || []); 
        
        // Đảm bảo totalPages ít nhất là 1 để UI không bị lỗi nếu mảng rỗng
        setTotalPages(result.meta?.totalPages || 1);
        
      } catch (error) {
        console.error("Lỗi tải dữ liệu courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [apiQuery, showFiltersAndPagination, currentPage, debouncedSearch, category]);

  return (
    <section style={{ background: "#f0f7ff", padding: "80px 0", minHeight: "100vh" }}>
      <div className="max-w-screen-2xl mx-auto px-6">
        
        {showFiltersAndPagination ? (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: "40px", color: BRAND_DARK }}>
                Chọn môn học
              </h2>
              <p className="text-gray-500 mt-2">Hiển thị {coursesList.length} môn học</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600 whitespace-nowrap">Tìm kiếm</span>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder=""
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-4 pr-10 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 w-full sm:w-64"
                  />
                  {/* Thêm lại icon kính lúp cho đẹp */}
                  <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">Phân loại</span>
                {/* Bắt sự kiện onChange cho thẻ select */}
                <select 
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setCurrentPage(1); // Trở về trang 1 khi đổi bộ lọc
                  }}
                  className="px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 bg-white min-w-32"
                >
                  <option value="all">All</option>
                  <option value="science">Khoa học tự nhiên</option>
                  <option value="social">Khoa học xã hội</option>
                </select>
              </div>
            </div>
          </div>
        ) : (
          <h2 className="mb-6" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: "40px", color: BRAND_DARK }}>
            Bộ đề thi của bạn
          </h2>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {isLoading ? (
            <p className="col-span-4 text-center text-gray-500 py-10">Đang tải khóa học...</p>
          ) : coursesList.length > 0 ? (
            coursesList.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))
          ) : (
            <p className="col-span-4 text-center text-gray-500 py-10">Không tìm thấy khóa học nào phù hợp.</p>
          )}
        </div>

        {showExploreButton && !showFiltersAndPagination && (
          <div className="flex justify-center">
            <button
              onClick={() => router.push("/student/courses")}
              className="px-10 py-4 rounded-full bg-white font-semibold transition-all hover:shadow-md"
              style={{
                border: "1px solid rgba(34,45,101,0.3)",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "20px",
                color: BRAND_DARK,
              }}
            >
              Khám phá thêm bộ đề
            </button>
          </div>
        )}

        {showFiltersAndPagination && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-[#e0f0ff] text-blue-600 disabled:opacity-50"
            >
              &lt;
            </button>
            
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                  currentPage === idx + 1 
                    ? "bg-[#f7a83a] text-white" 
                    : "bg-[#e0f0ff] text-blue-600 hover:bg-blue-100"
                }`}
              >
                {idx + 1}
              </button>
            ))}

            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-[#e0f0ff] text-blue-600 disabled:opacity-50"
            >
              &gt;
            </button>
          </div>
        )}

      </div>
    </section>
  );
}