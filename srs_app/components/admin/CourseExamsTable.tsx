'use client';

import { useState } from 'react';
import type { Exam } from '@/components/common/definitions';
import { useRouter } from 'next/navigation';
import { courseExamPrefixMap } from '@/lib/courseMappings';
import { DeleteExam } from './DeleteExam';
import { EditExam } from './EditExam';

interface ExamTableProps {
  exams: Exam[];
  onEdit: (exam: Exam) => void;
  onDelete: (id: string) => Promise<void>;
}

export function ExamTable({ exams, onEdit, onDelete }: ExamTableProps) {
  const router = useRouter();
  const [deletedId, setDeletedId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<Set<string>>(new Set());

  /** Find courseId whose prefix matches the exam id */
  const getCourseIdForExam = (examId: string): number | null => {
    for (const [courseIdStr, prefixes] of Object.entries(courseExamPrefixMap)) {
      const courseId = Number(courseIdStr);
      if (prefixes.some(prefix => examId.startsWith(prefix))) {
        return courseId;
      }
    }
    return null;
  };

  const handleDeleteWithOptimistic = async (id: string) => {
    // Optimistic UI: mark as deleting and remove from list
    setDeleting(prev => new Set(prev).add(id));
    setDeletedId(id); // remove from UI optimistically
    try {
      await onDelete(id);
      // Success: keep deletedId as is (still removed), just clear deleting flag
    } catch (err) {
      // Error: revert optimistic removal
      setDeletedId(null);
      throw err; // re-throw so DeleteExam can show error
    } finally {
      setDeleting(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tiêu đề
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Số câu hỏi
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {exams.map((exam) => {
            // Skip optimistically deleted row
            if (deletedId === exam.id) {
              return null;
            }
            const courseId = getCourseIdForExam(exam.id);
            const handleRowClick = () => {
              if (courseId !== null) {
                router.push(`/exams/${courseId}`);
              }
            };
            const isDeleting = deleting.has(exam.id);
            return (
              <tr
                key={exam.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={handleRowClick}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {exam.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {exam.questions.length}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <EditExam
                      onClick={() => onEdit(exam)}
                    />
                    <span className="mx-2">|</span>
                    <DeleteExam
                      examId={exam.id}
                      examTitle={exam.title}
                      isDeleting={isDeleting}
                      onDelete={handleDeleteWithOptimistic}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}