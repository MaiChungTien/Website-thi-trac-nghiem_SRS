import { ExamListSearchable } from '@/components/admin/ExamListSearchable';
import { AdminDashboardHero } from '@/components/admin/AdminDashboardHero';
import fs from 'fs/promises';
import path from 'path';
import type { Exam } from '@/components/common/definitions';

export default async function AllExamsPage() {
  const dbPath = path.join(process.cwd(), 'db.json');
  const fileData = await fs.readFile(dbPath, 'utf-8');
  const db = JSON.parse(fileData) as {
    users: any[];
    courses: any[];
    exams: Exam[];
  };

  const exams = db.exams;

  return (
    <>
      <AdminDashboardHero title="Quản lý đề thi" subtitle="Quản lý tất cả đề thi trong hệ thống"/>
      <section className="bg-[#f2f7ff] py-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <ExamListSearchable
              exams={exams}
              title="Quản lý đề thi"
              placeholder="Tìm kiếm đề thi..."
            />
          </div>
      </section>
    </>
  );
}