"use client"; // Bắt buộc phải có để sử dụng onClick và useRouter

import { useRouter } from "next/navigation";

const imgAvatar = "/images/ban_co_van.svg";
const BRAND_NAVY = "#11267f";

export default function HeroSection() {
  // Khởi tạo router bên trong component
  const router = useRouter();

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: BRAND_NAVY, minHeight: "520px" }}
    >
      <div className="max-w-screen-2xl mx-auto px-6 py-16 flex gap-8">
        {/* Left: Text content */}
        <div className="flex-1 flex flex-col justify-center min-w-0 z-10">
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "30px", color: "white", lineHeight: "1.15" }}>
            Welcome to
          </p>
          <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: "60px", color: "white", lineHeight: "1.15", marginBottom: "32px" }}>
            SRS Academy!
          </h1>
          <button
            // Sử dụng router.push thay vì navigate
            onClick={() => router.push("/courses")}
            className="self-start px-8 py-4 rounded-full border-2 border-white text-white font-semibold transition-all hover:bg-white hover:text-blue-900"
            style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "20px" }}
          >
            Bắt đầu thi thử
          </button>
        </div>

        {/* Center: Quote */}
        <div
          className="hidden lg:flex flex-col justify-center flex-1 pl-8"
          style={{ borderLeft: "1px solid white" }}
        >
          <p
            className="mb-4"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontStyle: "italic", fontSize: "18px", color: "white", lineHeight: "26px", letterSpacing: "-0.36px" }}
          >
            Lời khuyên học tập
          </p>
          <p
            className="mb-6"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: "20px", color: "white", lineHeight: "30px", letterSpacing: "-0.4px" }}
          >
            Đừng ngại thử thách bản thân với những đề thi khó. Mỗi lần chọn sai là một lần ghi nhớ sâu hơn. Hãy để mỗi bài kiểm tra trở thành một bước đệm vững chắc đưa bạn đến với kết quả mong đợi.
          </p>
          <div className="flex items-center gap-4">
            <img src={imgAvatar} alt="" className="w-12 h-12 rounded-full object-cover" />
            <div>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: "16px", color: "white" }}>Lammert Fopma</p>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "14px", color: "white" }}>
                Ban Cố vấn Học tập <strong>SRS</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}