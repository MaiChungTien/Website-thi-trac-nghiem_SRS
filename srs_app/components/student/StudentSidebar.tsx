"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/student/dashboard", label: "Dashboard", icon: <path d="M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z" /> },
  { href: "/student/courses", label: "Courses", icon: <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z M4 19h16" /> },
  { href: "/student/exams", label: "Exams", icon: <path d="M6 3h12v18H6V3Zm3 4h6m-6 4h6m-6 4h3" /> },
];

export function StudentSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-slate-200 bg-white lg:min-h-screen lg:w-64 lg:border-r lg:border-b-0">
      <Link href="/student/dashboard" className="flex items-center gap-3 px-6 py-6 text-lg font-bold text-slate-900">
        <span className="flex size-9 items-center justify-center rounded-xl bg-cyan-600 text-white">S</span>
        Student Portal
      </Link>
      <nav aria-label="Student navigation" className="flex gap-2 overflow-x-auto px-3 pb-4 lg:flex-1 lg:flex-col lg:px-4">
        {navigation.map((item) => {
          const active = pathname === item.href || (item.href !== "/student/dashboard" && pathname.startsWith(`${item.href}/`));
          return (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${active ? "bg-cyan-50 text-cyan-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-5 shrink-0" aria-hidden="true">{item.icon}</svg>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-100 p-3 lg:mt-auto lg:p-4">
        <Link href="/student/profile" className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${pathname === "/student/profile" ? "bg-cyan-50 text-cyan-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-5 shrink-0" aria-hidden="true">
            <path d="M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" />
          </svg>
          Profile &amp; settings
        </Link>
      </div>
    </aside>
  );
}
