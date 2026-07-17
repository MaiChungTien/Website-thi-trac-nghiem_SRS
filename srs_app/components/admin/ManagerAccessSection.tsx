import Link from "next/link";

const managementLinks = [
  { href: "/users", label: "Danh sách thành viên", detail: "Quản lý tài khoản và phân quyền" },
  { href: "/courses", label: "Danh sách môn học", detail: "Cập nhật môn học và bộ đề" },
  { href: "/exams", label: "Danh sách đề thi", detail: "Tạo và quản lý đề kiểm tra" },
  { href: "/questionbank", label: "Ngân hàng câu hỏi", detail: "Quản lý câu hỏi theo môn học" },
];

type ManagerAccessSectionProps = {
  userCount: number;
};

export function ManagerAccessSection({ userCount }: ManagerAccessSectionProps) {
  return (
    <section className="bg-[#f2f7ff] py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-[#17266d]">Manager access</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {managementLinks.map((item, index) => (
            <article key={item.label} className="rounded-xl bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900">{item.label}</h3>
              <div className="my-4 border-t border-slate-200" />
              <p className="min-h-10 text-sm text-slate-500">
                {index === 0 ? `${userCount} thành viên` : item.detail}
              </p>
              <Link
                href={item.href}
                className="mt-4 inline-flex rounded-full bg-sky-500 px-8 py-2 text-sm font-semibold text-white transition hover:bg-sky-600"
              >
                Đi
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}