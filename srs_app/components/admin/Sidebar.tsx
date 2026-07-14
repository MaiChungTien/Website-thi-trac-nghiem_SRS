import Link from "next/link";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/users", label: "Người dùng" },
  { href: "/exams", label: "Đề thi" },
  { href: "/reports", label: "Thống kê" },
];

export function Sidebar() {
  return (
    <aside className="w-72 border-r border-slate-200 bg-slate-900 px-6 py-8 text-slate-100">
      <h2 className="text-xl font-semibold">Admin Panel</h2>
      <nav className="mt-8 space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block rounded-lg px-4 py-3 text-sm transition hover:bg-slate-800"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
