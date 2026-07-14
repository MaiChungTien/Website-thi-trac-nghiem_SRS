type Props = {
  params: Promise<{ resultId: string }>;
};

export default async function ExamResultPage({ params }: Props) {
  const { resultId } = await params;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Kết quả bài thi #{resultId}</h1>
      <p className="mt-2 text-sm text-slate-600">
        Hiển thị đáp án đúng, điểm số và thống kê từng câu hỏi.
      </p>
    </section>
  );
}
