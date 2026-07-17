'use client';

import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Course } from '@/components/admin/admin-dashboard-types';
import type { Exam } from '@/components/common/definitions';
import { CourseExamSearchableTable } from '@/components/admin/CourseExamSearchableTable';
import { idFromSlug, courseExamPrefixMap } from '@/lib/courseMappings';
import { toast } from 'react-toastify';

async function getCourseData(slug: string) {
  // Fetch courses and exams from API routes
  const [coursesRes, examsRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/courses?limit=100`),
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/exams`),
  ]);

  if (!coursesRes.ok || !examsRes.ok) {
    throw new Error('Failed to fetch data');
  }

  const coursesData = await coursesRes.json();
  const examsData = await examsRes.json();

  // coursesData shape: { data: Course[], meta: {...} }
  const courses: Course[] = coursesData.data;
  const exams: Exam[] = examsData; // exams endpoint returns array directly

  const courseId = idFromSlug(slug);
  if (!courseId) {
    return { course: null, exams: [], allCourses: [] };
  }

  const course = courses.find((c) => {
    const cid = typeof c.id === 'string' ? parseInt(c.id, 10) : c.id;
    return cid === courseId;
  });

  if (!course) {
    return { course: null, exams: [], allCourses: [] };
  }

  const prefixes = courseExamPrefixMap[courseId] || [];
  const filteredExams = exams.filter((exam) =>
    prefixes.some((prefix) => exam.id.startsWith(prefix))
  );

  return { course, exams: filteredExams, allCourses: courses };
}

export default function CourseExamsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const [slug, setSlug] = useState('');
  const [course, setCourse] = useState<Course | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Set slug from params once resolved
  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  // Fetch data when slug changes
  useEffect(() => {
    if (!slug) return;
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const { course: fetchedCourse, exams: fetchedExams, allCourses: fetchedAllCourses } = await getCourseData(slug);
        if (isMounted) {
          setCourse(fetchedCourse);
          setExams(fetchedExams);
          setAllCourses(fetchedAllCourses);
        }
      } catch (error) {
        console.error('Failed to fetch course data:', error);
        if (isMounted) {
          toast.error('Failed to load course data');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return <div className="flex h-[20rem] items-center justify-center">Loading...</div>;
  }

  if (!course) {
    return notFound();
  }

  const handleExamAdded = () => {
    setLoading(true);
    getCourseData(slug)
      .then(({ course: fetchedCourse, exams: fetchedExams, allCourses: fetchedAllCourses }) => {
        setCourse(fetchedCourse);
        setExams(fetchedExams);
        setAllCourses(fetchedAllCourses);
      })
      .catch(err => {
        console.error('Failed to refetch:', err);
        toast.error('Failed to refresh data');
      })
      .finally(() => setLoading(false));
  };

  const handleExamDeleted = () => {
    setLoading(true);
    getCourseData(slug)
      .then(({ course: fetchedCourse, exams: fetchedExams, allCourses: fetchedAllCourses }) => {
        setCourse(fetchedCourse);
        setExams(fetchedExams);
        setAllCourses(fetchedAllCourses);
      })
      .catch(err => {
        console.error('Failed to refetch:', err);
        toast.error('Failed to refresh data');
      })
      .finally(() => setLoading(false));
  };

  return (
    <CourseExamSearchableTable
      course={course}
      exams={exams}
      allCourses={allCourses}
      onExamAdded={handleExamAdded}
      onExamDeleted={handleExamDeleted}
    />
  );
}