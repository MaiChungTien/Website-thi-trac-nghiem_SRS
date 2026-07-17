import { AdminDashboardHero } from '@/components/admin/AdminDashboardHero'

export default function QuestionBankPage() {
  return (
    <>
      <AdminDashboardHero
        title="Ngân hàng câu hỏi"
        subtitle="Quản lý câu hỏi cho các đề thi"
      />
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
        <p className="text-center text-slate-500">
          Ngân hàng câu hỏi đang được phát triển...
        </p>
      </div>
    </>
  )
}