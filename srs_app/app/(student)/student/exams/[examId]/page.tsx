type Props = {
  params: Promise<{ examId: string }>;
};

export default async function ExamDetailPage({ params }: Props) {
  const { examId } = await params;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Đề thi #{examId}</h1>
      <p className="mt-2 text-sm text-slate-600">
        Đây là nơi hiển thị câu hỏi, đáp án và thao tác nộp bài.
      </p>
    </section>
  );
}
