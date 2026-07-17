import type { ReactNode } from "react";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-100" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Header isLoggedIn role="admin" />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}