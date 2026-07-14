
import { Suspense } from 'react';
import { CardsSkeleton } from '@/app/ui/skeletons';

export default function StudentDashboardPage(){
  return(
    <section className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Bộ đề thi</h1>
          <p className="mt-2 text-sm text-slate-600">
            My recent courses
          </p>
        </div>
      <div>
        <Suspense fallback={<CardsSkeleton/>}>

        </Suspense>
      </div>
    </section>
  )
}