import Link from "next/link";

const links = [
  { href: "/courses", label: "Danh sách đề thi" },
  { href: "/profile", label: "Thông tin cá nhân" },
];

export function StudentNavbar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/courses" className="text-lg font-semibold text-slate-900">
          Thi Trắc Nghiệm
        </Link>
        <nav className="flex items-center gap-4 text-sm text-slate-600">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-cyan-600">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
