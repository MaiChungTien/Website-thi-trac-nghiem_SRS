import Link from "next/link";
import { Button } from "@/components/common/Button";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <div className="w-full max-w-5xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-600">Website thi trắc nghiệm</p>
            <h1 className="mt-4 text-4xl font-semibold text-slate-900 sm:text-5xl">
              Hệ thống ôn luyện và làm bài thi trực tuyến
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-600">
              Hỗ trợ khách, thành viên và quản trị viên trong việc đăng ký, làm bài thi, xem kết quả và quản lý ngân hàng đề.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/auth/login">
                <Button>Đăng nhập</Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="secondary">Đăng ký</Button>
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-semibold text-slate-900">Tính năng chính</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>• Làm bài thi theo từng môn học và bộ đề</li>
              <li>• Xem kết quả và lịch sử điểm số</li>
              <li>• Quản lý người dùng, đề thi và thống kê cho admin</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
