import { NextResponse } from 'next/server';
import type { Exam, ExamQuestion } from '@/components/common/definitions';
import fs from 'fs/promises';
import path from 'path';
import { courseExamPrefixMap } from '@/lib/courseMappings';

const DB_PATH = path.join(process.cwd(), 'db.json');

/**
 * Helper: read the whole DB and return the typed object.
 */
async function readDB() {
  const raw = await fs.readFile(DB_PATH, 'utf-8');
  const data = JSON.parse(raw) as {
    users: any[];
    courses: any[];
    exams: Exam[];
  };
  return data;
}

/**
 * Helper: write the whole DB back to disk.
 */
async function writeDB(data: { users: any[]; courses: any[]; exams: Exam[] }) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * GET /api/exams
 *   - optional query ?id=math-1  → return only the exam with that id
 *   - optional query ?courseId=1  → return only exams for that course
 *   - optional query ?title=math  → return only exams with title containing "math" (case-insensitive)
 *   - optional query ?search=math → same as ?title=
 *   - if id is provided, ignore other filters and return matching exam(s)
 *   - if both ?courseId and ?title/search are provided, apply both filters (course first then title)
 *   - otherwise return all exams
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idSearch = searchParams.get('id');
    const courseIdStr = searchParams.get('courseId');
    const titleSearch = searchParams.get('title') ?? searchParams.get('search');
    const db = await readDB();

    let exams = [...db.exams];

    if (idSearch) {
      // If ID is specified, filter by exact ID match (ignore other filters)
      exams = exams.filter(e => e.id === idSearch);
    } else {
      if (courseIdStr) {
        const courseId = Number(courseIdStr);
        const prefixes = courseExamPrefixMap[courseId] || [];
        if (prefixes.length) {
          exams = exams.filter((e) =>
            prefixes.some((p) => e.id.startsWith(p))
          );
        } else {
          // no exams defined for this course → empty array
          exams = [];
        }
      }

      if (titleSearch) {
        const searchLower = titleSearch.toLowerCase();
        exams = exams.filter((e) => e.title.toLowerCase().includes(searchLower));
      }
    }

    return NextResponse.json(exams);
  } catch (err: any) {
    console.error('GET /api/exams error:', err);
    return NextResponse.json(
      { error: 'Failed to read exams' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/exams
 *   Body: { id, title, questions: [{id,question,options,answer}, …] }
 *   Appends a new exam to db.json
 */
export async function POST(request: Request) {
  try {
    const body: Omit<Exam, never> = await request.json();
    // Very light validation – you can expand as needed
    if (!body.id || !body.title || !Array.isArray(body.questions)) {
      return NextResponse.json(
        { error: 'Invalid exam payload' },
        { status: 400 }
      );
    }

    const db = await readDB();
    // Prevent duplicate id
    if (db.exams.some((e) => e.id === body.id)) {
      return NextResponse.json(
        { error: 'Exam with this id already exists' },
        { status: 409 }
      );
    }

    db.exams.push(body as Exam);

    // Update the course's exam count
    try {
      // Find which course this exam belongs to
      let courseUpdated = false;
      for (const [courseId, prefixes] of Object.entries(courseExamPrefixMap)) {
        const numericCourseId = parseInt(courseId, 10);
        if (prefixes.some(prefix => body.id.startsWith(prefix))) {
          // Found the course, update its exam count
          const courseIndex = db.courses.findIndex(c =>
            (typeof c.id === 'string' ? parseInt(c.id, 10) : c.id) === numericCourseId
          );
          if (courseIndex !== -1) {
            const currentExams = db.exams.filter(exam =>
              prefixes.some(prefix => exam.id.startsWith(prefix))
            ).length;
            db.courses[courseIndex].exams = `${currentExams} đề thi`;
            courseUpdated = true;
            break;
          }
        }
      }

      // No need to write db again here - we'll do it once at the end
    } catch (err) {
      console.warn('Failed to update course exam count:', err);
      // Don't fail the exam creation if course update fails
    }

    await writeDB(db);
    return NextResponse.json({ message: 'Exam created' }, { status: 201 });
  } catch (err: any) {
    console.error('POST /api/exams error:', err);
    return NextResponse.json(
      { error: 'Failed to create exam' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/exams
 *   Body: { id, title?, questions? } – only supplied fields are updated
 */
export async function PUT(request: Request) {
  try {
    const updates: Partial<Exam> & { id: string } = await request.json();
    if (!updates.id) {
      return NextResponse.json(
        { error: 'Exam id is required' },
        { status: 400 }
      );
    }

    const db = await readDB();
    const idx = db.exams.findIndex((e) => e.id === updates.id);
    if (idx === -1) {
      return NextResponse.json(
        { error: 'Exam not found' },
        { status: 404 }
      );
    }

    // Merge changes
    db.exams[idx] = { ...db.exams[idx], ...updates };
    await writeDB(db);
    return NextResponse.json({ message: 'Exam updated' });
  } catch (err: any) {
    console.error('PUT /api/exams error:', err);
    return NextResponse.json(
      { error: 'Failed to update exam' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/exams
 *   Query: ?id=math-1   (or JSON body {id: 'math-1'})
 */
export async function DELETE(request: Request) {
  try {
    // Support both query string and body
    const { searchParams } = new URL(request.url);
    const idFromQuery = searchParams.get('id');
    let id: string | null = idFromQuery;

    if (!id) {
      const body = await request.json();
      id = body.id;
    }

    if (!id) {
      return NextResponse.json(
        { error: 'Exam id is required' },
        { status: 400 }
      );
    }

    const db = await readDB();
    const examToDelete = db.exams.find(e => e.id === id);
    const initialLen = db.exams.length;
    db.exams = db.exams.filter((e) => e.id !== id);

    if (db.exams.length === initialLen) {
      return NextResponse.json(
        { error: 'Exam not found' },
        { status: 404 }
      );
    }

    // Update the course's exam count
    try {
      if (examToDelete) {
        // Find which course this exam belonged to
        let courseUpdated = false;
        for (const [courseId, prefixes] of Object.entries(courseExamPrefixMap)) {
          const numericCourseId = parseInt(courseId, 10);
          if (prefixes.some(prefix => examToDelete.id.startsWith(prefix))) {
            // Found the course, update its exam count
            const courseIndex = db.courses.findIndex(c =>
              (typeof c.id === 'string' ? parseInt(c.id, 10) : c.id) === numericCourseId
            );
            if (courseIndex !== -1) {
              const currentExams = db.exams.filter(exam =>
                prefixes.some(prefix => exam.id.startsWith(prefix))
              ).length;
              db.courses[courseIndex].exams = `${currentExams} đề thi`;
              courseUpdated = true;
              break;
            }
          }
        }

        // No need to write db again here - we'll do it once at the end
      }
    } catch (err) {
      console.warn('Failed to update course exam count after deletion:', err);
      // Don't fail the deletion if course update fails
    }

    await writeDB(db);
    return NextResponse.json({ message: 'Exam deleted' });
  } catch (err: any) {
    console.error('DELETE /api/exams error:', err);
    return NextResponse.json(
      { error: 'Failed to delete exam' },
      { status: 500 }
    );
  }
}