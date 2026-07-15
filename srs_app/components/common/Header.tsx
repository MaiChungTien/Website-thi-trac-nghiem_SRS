import Link from "next/link";
import Image from "next/image";

interface HeaderProps {
  isLoggedIn: boolean;
  role?: string;
}

export default function Header({ isLoggedIn, role }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="relative h-12 w-32">
          <Image src="/images/logo.svg" alt="SRS Academy" fill className="object-contain" />
        </Link>

        {/* Navigation - Đã chuyển sang Tailwind class */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-primary font-semibold hover:text-secondary transition-colors">Trang chủ</Link>
          <Link href="/about" className="text-surface-text font-medium hover:text-primary transition-colors">Giới thiệu</Link>
          <Link href="/courses" className="text-surface-text font-medium hover:text-primary transition-colors">Đề thi</Link>
          <Link href="/contact" className="text-surface-text font-medium hover:text-primary transition-colors">Liên hệ</Link>
        </nav>

        {/* Right Action */}
        <div className="flex items-center gap-4">
          <button className="hidden lg:flex items-center gap-2 text-surface-text hover:text-primary font-medium">
             <span>VI</span> {/* Icon cờ hoặc quả địa cầu có thể thêm ở đây */}
          </button>
          
          <div className="h-6 w-px bg-gray-200 hidden lg:block"></div>

          {isLoggedIn ? (
            <Link 
              href={role === "admin" ? "/dashboard" : "/student/dashboard"}
              className="px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-all shadow-md"
            >
              Vào Dashboard
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/auth/login" className="text-primary font-medium hover:underline">
                Đăng nhập
              </Link>
              <Link href="/auth/register" className="px-5 py-2.5 bg-secondary text-white font-medium rounded-lg hover:opacity-90 transition-all shadow-md">
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}