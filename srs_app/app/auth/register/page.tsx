// app/auth/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authService } from "@/services/auth.service";
import { toast } from "react-toastify";

// Import Schema và Type từ file validation.ts
import { registerSchema, type RegisterFormInputs } from "@/utils/validation";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      // 1. Tách bỏ confirmPassword vì server không cần trường này
      const { confirmPassword, ...submitData } = data;

      console.log("Đang gửi dữ liệu đăng ký:", submitData);

      // 2. Gọi API thông qua authService
      await authService.register(submitData);

      // 3. Hiển thị thông báo thành công (Nên dùng thư viện Toast ở đây)
      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");

      // 4. Điều hướng người dùng về trang đăng nhập
      router.push("/auth/login");
    } catch (error: any) {
      // Xử lý lỗi trả về từ API (ví dụ: Email đã tồn tại)
      console.error("Lỗi xử lý đăng ký:", error.message);
      toast.error(error.message || "Có lỗi xảy ra khi đăng ký");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ---------------- CỘT TRÁI - HERO BANNER ---------------- */}
      <div className="relative flex-1 hidden lg:flex flex-col min-w-0">
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
              Nền tảng ôn thi trắc nghiệm trực tuyến hàng đầu. Đăng ký ngay để
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

      {/* ---------------- CỘT PHẢI - FORM ĐĂNG KÝ ---------------- */}
      <div className="w-full lg:w-[600px] xl:w-[700px] flex flex-col justify-center px-8 sm:px-12 md:px-16 lg:px-20 bg-white z-10 py-10 h-screen overflow-y-auto">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="relative w-20 h-20 mb-4">
            <Image
              src="/images/logo.svg"
              alt="Logo Hệ thống"
              fill
              className="object-contain"
            />
          </div>
          <h2 className="text-2xl font-bold text-surface-text">
            Đăng ký tài khoản
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-sm font-medium text-surface-text">
                Tên đăng nhập <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("username")}
                className={`w-full px-4 py-3 rounded-lg bg-surface border outline-none text-surface-text text-sm transition-all ${
                  errors.username
                    ? "border-red-500 focus:border-red-500"
                    : "border-transparent focus:border-primary"
                }`}
              />
              {errors.username && (
                <p className="text-red-500 text-xs">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-surface-text">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("fullName")}
                className={`w-full px-4 py-3 rounded-lg bg-surface border outline-none text-surface-text text-sm transition-all ${
                  errors.fullName
                    ? "border-red-500 focus:border-red-500"
                    : "border-transparent focus:border-primary"
                }`}
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-surface-text">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                {...register("email")}
                className={`w-full px-4 py-3 rounded-lg bg-surface border outline-none text-surface-text text-sm transition-all ${
                  errors.email
                    ? "border-red-500 focus:border-red-500"
                    : "border-transparent focus:border-primary"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-surface-text">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("mobile")}
                className={`w-full px-4 py-3 rounded-lg bg-surface border outline-none text-surface-text text-sm transition-all ${
                  errors.mobile
                    ? "border-red-500 focus:border-red-500"
                    : "border-transparent focus:border-primary"
                }`}
              />
              {errors.mobile && (
                <p className="text-red-500 text-xs">{errors.mobile.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-surface-text">
              Địa chỉ
            </label>
            <input
              type="text"
              {...register("address")}
              className={`w-full px-4 py-3 rounded-lg bg-surface border outline-none text-surface-text text-sm transition-all ${
                errors.address
                  ? "border-red-500 focus:border-red-500"
                  : "border-transparent focus:border-primary"
              }`}
            />
            {errors.address && (
              <p className="text-red-500 text-xs">{errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-sm font-medium text-surface-text">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <div
                className={`flex rounded-lg border bg-surface transition-all ${
                  errors.password
                    ? "border-red-500"
                    : "border-transparent focus-within:border-primary"
                }`}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="flex-1 px-4 py-3 bg-transparent outline-none text-surface-text text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="px-3 text-xs font-medium text-primary hover:text-primary-dark"
                >
                  {showPassword ? "Ẩn" : "Hiện"}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-surface-text">
                Xác nhận mật khẩu <span className="text-red-500">*</span>
              </label>
              <div
                className={`flex rounded-lg border bg-surface transition-all ${
                  errors.confirmPassword
                    ? "border-red-500"
                    : "border-transparent focus-within:border-primary"
                }`}
              >
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  className="flex-1 px-4 py-3 bg-transparent outline-none text-surface-text text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="px-3 text-xs font-medium text-primary hover:text-primary-dark"
                >
                  {showConfirmPassword ? "Ẩn" : "Hiện"}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 mt-4 rounded-lg text-white font-semibold transition-all hover:opacity-90 bg-secondary shadow-md disabled:opacity-50"
          >
            {isSubmitting ? "Đang xử lý..." : "Đăng ký"}
          </button>

          <div className="text-center mt-4">
            <span className="text-sm text-gray-500">Đã có tài khoản? </span>
            <button
              type="button"
              onClick={() => router.push("/auth/login")}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Đăng nhập ngay
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
