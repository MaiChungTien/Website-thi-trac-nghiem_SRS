// app/auth/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authService } from "@/services/auth.service";

// Import Schema và Type từ file validation.ts
import { loginSchema, type LoginFormInputs } from "@/utils/validation";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await authService.login(data);

      // Kiểm tra role và điều hướng
      if (response.user.role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/student/dashboard");
      }
    } catch (error: any) {
      console.error("Lỗi đăng nhập:", error.message);
      // TODO: Hiển thị Toast thông báo lỗi ở đây
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ---------------- CỘT TRÁI - HERO BANNER ---------------- */}
      <div className="relative flex-1 hidden md:flex flex-col min-w-0">
        <Image
          src="/images/background.svg"
          alt="Background"
          fill
          className="absolute inset-0 object-cover"
          priority
        />

        <div className="absolute inset-0 bg-primary-dark/80" />

        <div className="relative z-10 flex items-center justify-between px-8 py-6">
          <div className="relative h-10 w-32">
            <Image
              src="/images/school_icon.svg"
              alt="Ausnutria"
              fill
              className="object-contain object-left"
            />
          </div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-end px-12 pb-16">
          <div className="max-w-xl">
            <h1 className="text-white mb-5 text-[35px] font-bold leading-snug">
              Chào mừng đến với SRS Academy!
            </h1>
            <p className="text-white mb-8 text-base font-medium leading-relaxed">
              Nền tảng ôn thi trắc nghiệm trực tuyến hàng đầu. Đăng nhập ngay để
              thử sức với hàng ngàn đề thi đa dạng, tích lũy điểm số và đánh giá
              tiến độ học tập của bản thân.
            </p>
            <div className="flex gap-3 items-center">
              <div className="h-1 w-12 bg-white rounded-full shadow-sm" />
              <div className="h-1 w-12 bg-gray-400/50 rounded-full" />
              <div className="h-1 w-12 bg-gray-400/50 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- CỘT PHẢI - FORM ĐĂNG NHẬP ---------------- */}
      <div className="w-full md:w-[500px] lg:w-[540px] flex flex-col justify-center px-8 md:px-12 lg:px-16 bg-white z-10">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="relative w-24 h-24 mb-4">
            <Image
              src="/images/logo.svg"
              alt="Logo Hệ thống"
              fill
              className="object-contain"
            />
          </div>
          <h2 className="text-xl font-bold text-surface-text">
            Đăng nhập tài khoản
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1">
            <label className="text-[15px] font-medium text-surface-text">
              Email:
            </label>
            <div
              className={`flex rounded-lg overflow-hidden border bg-surface transition-all ${
                errors.email
                  ? "border-red-500"
                  : "border-transparent focus-within:border-primary"
              }`}
            >
              <input
                type="email"
                {...register("email")}
                placeholder="info@provistechnologies.com"
                className="flex-1 px-4 py-3.5 bg-transparent outline-none text-surface-text text-sm"
              />
              <div className="flex items-center justify-center w-14 shrink-0 bg-primary m-0.5 rounded-md">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points="22,6 12,13 2,6"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-[15px] font-medium text-surface-text">
              Mật khẩu:
            </label>
            <div
              className={`flex rounded-lg overflow-hidden border bg-surface transition-all ${
                errors.password
                  ? "border-red-500"
                  : "border-transparent focus-within:border-primary"
              }`}
            >
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Nhập mật khẩu"
                className="flex-1 px-4 py-3.5 bg-transparent outline-none text-surface-text text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="flex items-center justify-center w-14 shrink-0 bg-primary m-0.5 rounded-md hover:bg-primary-dark transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="5"
                    y="11"
                    width="14"
                    height="10"
                    rx="2"
                    stroke="white"
                    strokeWidth="2"
                  />
                  <path
                    d="M8 11V7a4 4 0 0 1 8 0v4"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm font-medium text-primary hover:underline"
              onClick={() => router.push("/auth/forgot-password")}
            >
              Quên mật khẩu?
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 mt-2 rounded-lg text-white font-semibold transition-all hover:opacity-90 bg-secondary shadow-md disabled:opacity-50"
          >
            {isSubmitting ? "Đang xử lý..." : "Đăng nhập"}
          </button>

          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
              Hoặc
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <button
            type="button"
            onClick={() => router.push("/auth/register")}
            className="w-full py-3.5 rounded-lg font-semibold transition-colors hover:bg-gray-50 text-primary border border-primary"
          >
            Đăng ký tài khoản mới
          </button>
        </form>
      </div>
    </div>
  );
}
