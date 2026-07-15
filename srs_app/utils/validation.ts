// utils/validation.ts
import { z } from "zod";

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isValidPassword(value: string) {
  return value.length >= 6;
}

// === SCHEMA VALIDATION DÙNG CHO FORM LOGIN (ZOD) ===
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Vui lòng nhập email")
    .email("Định dạng email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export type LoginFormInputs = z.infer<typeof loginSchema>;

// === SCHEMA VALIDATION DÙNG CHO FORM REGISTER (ZOD) ===
export const registerSchema = z
  .object({
    username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
    fullName: z.string().min(1, "Vui lòng nhập họ và tên"),
    email: z.string().min(1, "Vui lòng nhập email").email("Định dạng email không hợp lệ"),
    mobile: z.string().regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, "Số điện thoại không hợp lệ"),
    address: z.string().min(1, "Vui lòng nhập địa chỉ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"], // Hiển thị lỗi ngay dưới trường confirmPassword
  });

export type RegisterFormInputs = z.infer<typeof registerSchema>;