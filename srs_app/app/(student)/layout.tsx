// LÀM ĐÚNG: app/(student)/layout.tsx
export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="student-layout-wrapper">
      {/* KHÔNG chứa <html> hay <body> ở đây */}
      {children}
    </div>
  );
}