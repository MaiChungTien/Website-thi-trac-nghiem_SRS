export function AdminDashboardHero({
  title = "System Administrator!",
  subtitle = "Welcome manager",
  titleActions
}: {
  title?: string;
  subtitle?: string;
  titleActions?: React.ReactNode;
}) {
  return (
    <section className="bg-[#273583] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2 md:items-center lg:px-8">
        <div>
          <p className="text-lg font-medium">{subtitle}</p>
          <div className="flex items-baseline space-x-4">
            <h1 className="mt-1 text-4xl font-bold tracking-tight">{title}</h1>
            {titleActions && <div className="ml-4 flex-shrink-0">{titleActions}</div>}
          </div>
        </div>
        <div className="border-l border-white/60 pl-6">
          <p className="text-sm italic text-white/90">Lời khuyên học tập</p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/95">
            Đừng ngại thử thách bản thân với những đề thi khó. Mỗi lần chọn sai là một lần ghi nhớ sâu hơn.
          </p>
          <p className="mt-4 text-sm font-semibold">Ban Cố vấn Học tập SRS</p>
        </div>
      </div>
    </section>
  );
}