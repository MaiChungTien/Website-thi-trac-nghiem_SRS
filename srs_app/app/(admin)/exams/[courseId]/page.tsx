'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { CourseExamSearchableTable } from '@/components/admin/CourseExamSearchableTable';
import type { Course } from '@/components/admin/admin-dashboard-types';
import type { Exam } from '@/components/common/definitions';

export default function ExamListPage() {
  const { courseId } = useParams();
  const id = Number(courseId);

  const [course, setCourse] = useState<Course | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [courseLoading, setCourseLoading] = useState(true);
  const [examsLoading, setExamsLoading] = useState(true);

  const fetchData = async () => {
    // Fetch courses
    try {
      setCourseLoading(true);
      const res = await fetch('/api/courses');
      if (!res.ok) throw new Error('Failed to fetch courses');
      const result = await res.json(); // { data: Course[], meta: {...} }
      const coursesData: Course[] = result.data ?? [];
      const courseObj = coursesData.find(c => c.id === id);
      if (!courseObj) {
        notFound();
      }
      setCourse(courseObj);
    } catch (err) {
      console.error(err);
    } finally {
      setCourseLoading(false);
    }

    // Fetch exams for this course
    try {
      setExamsLoading(true);
      const examsRes = await fetch(`/api/exams?courseId=${id}`);
      if (!examsRes.ok) throw new Error('Failed to fetch exams');
      const examsData: Exam[] = await examsRes.json();
      setExams(examsData);
    } catch (err) {
      console.error(err);
    } finally {
      setExamsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const refetchExams = async () => {
    setExamsLoading(true);
    try {
      const res = await fetch(`/api/exams?courseId=${id}`);
      if (!res.ok) throw new Error('Failed to fetch exams');
      const examsData: Exam[] = await res.json();
      setExams(examsData);
    } catch (err) {
      console.error(err);
    } finally {
      setExamsLoading(false);
    }
  };

  const handleExamAdded = (exam: Exam) => {
    setExams(prev => {
      const existingIndex = prev.findIndex(e => e.id === exam.id);
      if (existingIndex >= 0) {
        // replace existing exam
        const newArr = [...prev];
        newArr[existingIndex] = exam;
        return newArr;
      } else {
        // add new exam
        return [...prev, exam];
      }
    });
    // Optionally refetch to ensure consistency
    refetchExams();
  };

  const handleExamDeleted = (id: string) => {
    // Optimistically remove the exam from the list
    setExams(prev => prev.filter(exam => exam.id !== id));
    // Refetch to ensure consistency
    refetchExams();
  };

  const isLoading = courseLoading || examsLoading;

  if (!course) {
    // while loading courses, show spinner; if course not found after fetch, notFound already called
    return <div>Loading...</div>;
  }

  return (
    <>
      {isLoading && <div>Loading...</div>}
      {!isLoading && course && (
        <CourseExamSearchableTable
          course={course}
          exams={exams}
          onExamAdded={handleExamAdded}
          onExamDeleted={handleExamDeleted}
        />
      )}
    </>
  );
}