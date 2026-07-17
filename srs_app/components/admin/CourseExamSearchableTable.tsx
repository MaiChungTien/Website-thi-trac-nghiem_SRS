'use client';

import { toast } from 'react-toastify';
import { useState } from 'react';
import { AdminDashboardHero } from '@/components/admin/AdminDashboardHero';
import { ExamTable } from '@/components/admin/CourseExamsTable';
import { SearchExamBar } from '@/components/admin/SearchExamBar';
import { ExamForm } from './ExamForm';
import type { Course } from '@/components/admin/admin-dashboard-types';
import type { Exam } from '@/components/common/definitions';
import { courseExamPrefixMap } from '@/lib/courseMappings';

interface CourseExamSearchableTableProps {
  course: Course;
  exams: Exam[];
  allCourses?: Course[]; // optional list of all courses for the dropdown in ExamForm
  onExamAdded?: (exam: Exam) => void;
  onExamDeleted?: (id: string) => void;
}

export function CourseExamSearchableTable({ course, exams, allCourses, onExamAdded, onExamDeleted }: CourseExamSearchableTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 8;

  const [openForm, setOpenForm] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | undefined>(undefined);

  // Get the first prefix for this course to suggest ID prefix
  // Convert course.id to number for lookup in courseExamPrefixMap
  const courseId = typeof course.id === 'string' ? parseInt(course.id, 10) : course.id;
  const prefixes = courseExamPrefixMap[courseId] || [];
  const prefix = prefixes[0] || '';

  const filteredExams = exams.filter((exam) =>
    exam.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(Math.ceil(filteredExams.length / PAGE_SIZE), 1);
  // Ensure currentPage is within bounds
  const pageNumber = Math.min(Math.max(currentPage, 1), totalPages);
  if (pageNumber !== currentPage) {
    setCurrentPage(pageNumber);
  }

  const paginatedExams = filteredExams.slice(
    (pageNumber - 1) * PAGE_SIZE,
    pageNumber * PAGE_SIZE
  );

  const handleAddExam = () => {
    // Create a blank exam with empty id; the form will use the idPrefix to generate the ID on save
    setEditingExam(undefined);
    setOpenForm(true);
  };

  const handleEditExam = (exam: Exam) => {
    setEditingExam(exam);
    setOpenForm(true);
  };

  const handleDeleteExam = async (id: string) => {
    try {
      const res = await fetch(`/api/exams?id=${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Xóa đề thi không thành công.');
      }
      // Reset page to first after deletion to ensure valid page
      setCurrentPage(1);
      // Notify parent that exam was deleted
      if (onExamDeleted) {
        onExamDeleted(id);
      }
      toast.success('Xóa đề thi thành công!');
    } catch (err: any) {
      toast.error(err.message ?? 'Xóa đề thi không thành công.');
    }
  };

  const handleSaveExam = async (exam: Exam, isNew: boolean) => {
    const method = isNew ? 'POST' : 'PUT';
    try {
      const res = await fetch('/api/exams', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exam),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Failed to save exam');
      }
      // Reset page to first to show newly added/edited item
      setCurrentPage(1);
      // Notify parent that exam was saved
      if (onExamAdded) {
        onExamAdded(exam);
      }
      toast.success(isNew ? 'Thêm mới đề thi thàn công!' : 'Chỉnh sửa đề thi thành công');
    } catch (err: any) {
      toast.error(err.message ?? 'Lưu đề thi không thành công');
    }
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingExam(undefined);
  };

  return (
    <>
      <AdminDashboardHero
        title={`Quản lý đề thi: ${course.title}`}
        subtitle="Danh sách các đề thi thuộc môn học này"
      />
      <section className="bg-[#f2f7ff] py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#17266d]">Danh sách đề thi</h2>
            <div className="flex items-center space-x-3">
              <SearchExamBar
                onSearchChange={setSearchTerm}
                placeholder="Tìm kiếm đề thi..."
                value={searchTerm}
              />
              <button
                onClick={handleAddExam}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                Thêm đề thi
              </button>
            </div>
          </div>
          <ExamTable
            exams={paginatedExams}
            onEdit={handleEditExam}
            onDelete={handleDeleteExam}
          />
          {filteredExams.length > 0 && (
            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={pageNumber === 1}
                className="flex items-center justify-center w-10 h-10 text-surface-text hover:text-primary hover:bg-gray-50 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <span className="text-sm text-surface-text">
                Trang {pageNumber} của {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={pageNumber === totalPages}
                className="flex items-center justify-center w-10 h-10 text-surface-text hover:text-primary hover:bg-gray-50 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Exam Form Modal */}
      {openForm && (
        <ExamForm
          exam={editingExam}
          onSave={handleSaveExam}
          onClose={handleCloseForm}
          idPrefix={prefix} // Pass the course prefix to the form for ID generation
          courses={allCourses} // Provide all courses for the dropdown
        />
      )}
    </>
  );
}