// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Lấy thông tin từ Cookie
  const token = request.cookies.get("auth_token")?.value;
  const role = request.cookies.get("user_role")?.value;

  // Định nghĩa các nhóm Route (Dựa theo cấu trúc bạn đã cung cấp)
  const isAuthRoute = pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register");
  const isAdminRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/users") || pathname.startsWith("/reports") || pathname.startsWith("/exams");
  const isStudentRoute = pathname.startsWith("/student/dashboard") || pathname.startsWith("/profile") || pathname.startsWith("/results") || (pathname.startsWith("/exams/") && !isAdminRoute);

  // Kịch bản 1: Đã đăng nhập nhưng cố tình vào lại trang Login/Register
  if (isAuthRoute && token) {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/student/dashboard", request.url));
  }

  // Kịch bản 2: Chưa đăng nhập mà cố tình vào các trang yêu cầu bảo mật
  if (!token && (isAdminRoute || isStudentRoute)) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Kịch bản 3: Đã đăng nhập, nhưng đi sai luồng quyền hạn (Phân quyền Role-based)
  if (token) {
    // Sinh viên mò vào trang Admin
    if (role === "student" && isAdminRoute) {
      return NextResponse.redirect(new URL("/courses", request.url));
    }
    // Admin mò vào trang Sinh viên (Tuỳ logic dự án, thường sẽ đẩy về dashboard)
    if (role === "admin" && isStudentRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Hợp lệ tất cả -> Cho phép đi tiếp
  return NextResponse.next();
}

// Cấu hình matcher để middleware chạy trên tất cả các route ngoại trừ tài nguyên tĩnh
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/ (thư mục ảnh public của bạn)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images/).*)',
  ],
};