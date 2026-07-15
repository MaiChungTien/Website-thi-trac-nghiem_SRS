// src/app/page.tsx
import { cookies } from "next/headers";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import HeroSection from "@/components/common/HeroSection";
import CoursesSection from "@/components/common/CoursesSection";

// Bắt buộc render lại mỗi khi có request để kiểm tra cookie mới nhất
export const dynamic = 'force-dynamic';

export default async function LandingPage() {
  // Đọc trực tiếp Cookie từ Server
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const role = cookieStore.get("user_role")?.value;
  const isLoggedIn = !!token;

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* 1. Truyền attribute động cho Header */}
      <Header isLoggedIn={isLoggedIn} role={role} />
      
      <HeroSection />
      
      {/* 2. Gọi API riêng cho trang chủ: Lấy top 4 course rating 5.0 */}
      <CoursesSection 
        apiQuery="?rating=5.0&limit=4" 
        showExploreButton={true} 
      />
      
      <Footer />
    </div>
  );
}