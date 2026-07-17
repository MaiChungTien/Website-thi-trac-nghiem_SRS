'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Course } from "./admin-dashboard-types";
import { getCourseSlug } from '@/lib/courseMappings';
import { SearchExamBar } from '@/components/admin/SearchExamBar';

type ManagedCoursesSectionProps = {
  courses: Course[];
};

export function ManagedCoursesSection({ courses }: ManagedCoursesSectionProps) {
  const PAGE_SIZE = 8; // 4 per row * 2 rows
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(Math.ceil(courses.length / PAGE_SIZE), 1);
  const paginatedCourses = courses.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <section className="bg-[#f2f7ff] py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {paginatedCourses.map(course => (
            <article key={course.id} className="overflow-hidden rounded-xl bg-white shadow-sm">
              <div className="relative h-44 bg-slate-200">
                <Image src={course.img} alt={course.title} fill className="object-cover" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3 text-sm">
                  <span className="text-slate-500">{course.exams} đề thi</span>
                  <span className="font-semibold text-amber-500">★★★★★ {course.rating}</span>
                </div>
                <h3 className="mt-4 font-bold text-slate-900">{course.title}</h3>
                <p className="mt-3 min-h-18 text-sm leading-5 text-slate-500 line-clamp-3">{course.description}</p>
                <Link
                  href={`/courses/${getCourseSlug(course.id)}`}
                  className="mt-5 inline-flex rounded-full bg-sky-500 px-6 py-2 text-sm font-semibold text-white transition hover:bg-sky-600"
                >
                  Quản lý
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination Controls */}
        {courses.length > PAGE_SIZE && (
          <div className="mt-8 flex justify-center items-center space-x-3">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center justify-center w-10 h-10 text-surface-text hover:text-primary hover:bg-gray-50 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <span className="text-sm text-surface-text">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center w-10 h-10 text-surface-text hover:text-primary hover:bg-gray-50 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        )}

        <div className="mt-10 text-center">
          <Link href="/exams" className="inline-flex rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-[#17266d] transition hover:bg-slate-50">
            Xem các bộ đề thi
          </Link>
        </div>
      </div>
    </section>
  );
}