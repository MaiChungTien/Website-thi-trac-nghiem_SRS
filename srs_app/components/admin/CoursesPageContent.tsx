'use client';

import { useState } from 'react';
import { AdminDashboardHero } from '@/components/admin/AdminDashboardHero';
import { ManagedCoursesSection } from '@/components/admin/ManagedCoursesSection';
import { SearchExamBar } from '@/components/admin/SearchExamBar';
import type { Course } from '@/components/admin/admin-dashboard-types';

interface CoursesPageContentProps {
  courses: Course[];
}

export function CoursesPageContent({ courses }: CoursesPageContentProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <AdminDashboardHero
        title="Quản lý bộ môn"
        subtitle="Quản lý các môn học trong hệ thống"
      />
      <section className="bg-[#f2f7ff] py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#17266d]">Quản lý bộ môn</h2>
            <SearchExamBar
              onSearchChange={setSearchTerm}
              placeholder="Tìm kiếm môn học..."
              value={searchTerm}
            />
          </div>
          <ManagedCoursesSection courses={filteredCourses} />
        </div>
      </section>
    </>
  );
}