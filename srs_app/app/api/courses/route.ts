// src/app/api/courses/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: Request) {
  try {
    // Lấy các tham số từ URL
    const { searchParams } = new URL(request.url);
    const rating = searchParams.get('rating');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '8'); // Mặc định 8 course 1 trang

    const dbPath = path.join(process.cwd(), 'db.json');
    const fileData = await fs.readFile(dbPath, 'utf8');
    const db = JSON.parse(fileData);
    
    let courses = db.courses;

    // 1. Logic Lọc (Filter) theo Rating
    if (rating) {
      courses = courses.filter((c: any) => c.rating === rating);
    }

    // 2. Logic Phân trang (Pagination)
    const total = courses.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCourses = courses.slice(startIndex, endIndex);

    // Trả về dữ liệu kèm theo thông tin phân trang (Meta data)
    return NextResponse.json({
      data: paginatedCourses,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Lỗi khi đọc file db.json:", error);
    return NextResponse.json({ data: [], meta: {} }, { status: 500 });
  }
}