'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AdminDashboardHero } from '@/components/admin/AdminDashboardHero';
import { SearchExamBar } from '@/components/admin/SearchExamBar';
import type { ExamQuestion, Exam } from '@/components/common/definitions';

interface CourseExamSearchableProps {
  exams: Exam[];
  courseTitle: string;
}

export function CourseExamSearchable({ exams, courseTitle }: CourseExamSearchableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredExams = useMemo(() => {
    if (!searchTerm.trim()) return exams;
    const term = searchTerm.toLowerCase().trim();
    return exams.filter(exam =>
      exam.title.toLowerCase().includes(term)
    );
  }, [exams, searchTerm]);

  return (
    <>
      <div className="mb-4">
        <Link href="/courses" className="text-blue-600 hover:underline">
          ← Quay lại danh sách bộ môn
        </Link>
      </div>
      <AdminDashboardHero
        title={`Quản lý đề thi: ${courseTitle}`}
        subtitle="Danh sách các đề thi thuộc môn học này"
        titleActions={
          <SearchExamBar
            onSearchChange={setSearchTerm}
            value={searchTerm}
            placeholder="Tìm kiếm đề thi..."
          />
        }
      />
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-12">
        {filteredExams.length === 0 ? (
          <p className="text-center text-slate-500 py-12">
            Chưa có đề thi nào cho môn này.
          </p>
        ) : (
          <div className="space-y-6">
            {filteredExams.map((exam) => (
              <div key={exam.id} className="border rounded-lg p-4 bg-white shadow-sm">
                <h3 className="font-bold text-lg mb-2">{exam.title}</h3>
                <p className="text-sm text-slate-600 mb-3">
                  {exam.questions.length} câu hỏi
                </p>
                <div className="space-y-2 text-sm">
                  {exam.questions.map((q) => (
                    <div key={q.id} className="border-b pb-2 last:border-b-0">
                      <p className="font-medium">{q.question}</p>
                      <ul className="list-disc list-inside mt-1 text-sm">
                        {q.options.map((opt, idx) => (
                          <li key={idx}>
                            {String.fromCharCode(65 + idx)}. {opt}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-1 text-xs text-green-600">
                        Đáp án: {q.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}