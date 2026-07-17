'use client';

import { useState } from 'react';
import { AdminDashboardHero } from "@/components/admin/AdminDashboardHero";
import { ManagedCoursesSection } from "@/components/admin/ManagedCoursesSection";
import { SearchExamBar } from "@/components/admin/SearchExamBar";
import type { Course } from "@/components/admin/admin-dashboard-types";

interface CoursesSearchableProps {
  courses: Course[];
}

export function CoursesSearchable({ courses }: CoursesSearchableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <SearchExamBar
        onSearchChange={setSearchTerm}
        placeholder="Tìm kiếm môn học..."
        value={searchTerm}
      />
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-12">
        <ManagedCoursesSection courses={filteredCourses} />
      </div>
    </>
  );
}