// src/components/common/HeroSection.tsx
"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

const imgAvatar = "/images/ban_co_van.svg";
const BRAND_NAVY = "#11267f";

// Định nghĩa các props để Component linh hoạt thay đổi theo từng trang
interface HeroSectionProps {
  variant?: "default" | "courses" | "exams" | "exam-detail";
  title?: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export default function HeroSection({
  variant = "default",
  title,
  subtitle,
  breadcrumbs,
}: HeroSectionProps) {
  const router = useRouter();

  // -------------------------------------------------------------
  // GIAO DIỆN 1: DÀNH CHO TRANG COURSES (Hình 1)
  // -------------------------------------------------------------
  if (variant === "courses") {
    return (
      <section
        className="relative overflow-hidden flex flex-col justify-center border-b border-blue-900"
        style={{ background: BRAND_NAVY, minHeight: "400px" }}
      >
        {/* Lớp mờ và Hình ảnh tòa nhà bên phải (Cần bổ sung ảnh vào public/images) */}
        <div className="absolute right-0 top-0 bottom-0 w-[50%] opacity-70 mix-blend-luminosity">
          <Image
            src="/images/background.svg" // Đổi thành tên file ảnh thực tế của bạn
            alt="Building background"
            fill
            className="object-cover object-right"
          />
        </div>
        
        {/* Gradient overlay để text không bị chìm vào ảnh */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#11267f] via-[#11267f]/90 to-transparent z-0"></div>

        <div className="max-w-screen-2xl mx-auto px-6 w-full relative z-10 flex flex-col justify-center h-full pt-10 pb-6">
          <h1
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 700,
              fontSize: "40px",
              color: "white",
              marginBottom: "12px",
            }}
          >
            {title || "Các bộ đề thi"}
          </h1>
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "16px",
              color: "white",
              marginBottom: "32px",
            }}
          >
            {subtitle || "Hiện tại, chúng tôi có nhiều đề thi đa dạng"}
          </p>

          {/* Breadcrumbs */}
          <div className="mt-auto border-t border-white/20 pt-4 w-fit">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">
              <span
                className="text-white/80 text-sm font-medium cursor-pointer hover:text-white transition-colors"
                onClick={() => router.push("/")}
              >
                Home
              </span>
              <span className="text-white/60 text-sm">&gt;</span>
              <span className="text-white text-sm font-medium">
                Courses
              </span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // -------------------------------------------------------------
  // GIAO DIỆN MẶC ĐỊNH: TRANG CHỦ / DASHBOARD (Hình 2)
  // -------------------------------------------------------------
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: BRAND_NAVY, minHeight: "400px" }}
    >
      <div className="max-w-screen-2xl mx-auto px-6 py-16 flex gap-8">
        {/* Left: Text content */}
        <div className="flex-1 flex flex-col justify-center min-w-0 z-10">
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 600,
              fontSize: "30px",
              color: "white",
              lineHeight: "1.15",
            }}
          >
            Welcome to
          </p>
          <h1
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 700,
              fontSize: "60px",
              color: "white",
              lineHeight: "1.15",
              marginBottom: "32px",
            }}
          >
            SRS Academy!
          </h1>
          <button
            onClick={() => router.push("/student/courses")}
            className="self-start px-8 py-4 rounded-full border-2 border-white text-white font-semibold transition-all hover:bg-white hover:text-blue-900"
            style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "20px" }}
          >
            Bắt đầu thi thử
          </button>
        </div>

        {/* Center: Quote */}
        <div
          className="hidden lg:flex flex-col justify-center flex-1 pl-8"
          style={{ borderLeft: "1px solid rgba(255,255,255,0.3)" }}
        >
          <p
            className="mb-4"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontStyle: "italic",
              fontSize: "18px",
              color: "white",
              lineHeight: "26px",
              letterSpacing: "-0.36px",
            }}
          >
            Lời khuyên học tập
          </p>
          <p
            className="mb-6"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
              fontSize: "20px",
              color: "white",
              lineHeight: "30px",
              letterSpacing: "-0.4px",
            }}
          >
            Đừng ngại thử thách bản thân với những đề thi khó. Mỗi lần chọn sai là
            một lần ghi nhớ sâu hơn. Hãy để mỗi bài kiểm tra trở thành một bước
            đệm vững chắc đưa bạn đến với kết quả mong đợi.
          </p>
          <div className="flex items-center gap-4">
            <img
              src={imgAvatar}
              alt="Ban Cố vấn"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: "16px",
                  color: "white",
                }}
              >
                Lammert Fopma
              </p>
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "14px",
                  color: "white",
                }}
              >
                Ban Cố vấn Học tập <strong>SRS</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

