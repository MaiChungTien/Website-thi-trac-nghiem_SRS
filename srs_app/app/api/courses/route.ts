// src/app/api/courses/route.ts
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rating = searchParams.get("rating");
    const search = searchParams.get("search"); // Lấy từ khóa tìm kiếm
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "8");

    const dbPath = path.join(process.cwd(), "db.json");
    const fileData = await fs.readFile(dbPath, "utf8");
    const db = JSON.parse(fileData);

    let courses = db.courses;

    // 1. Lọc theo Rating
    if (rating) {
      courses = courses.filter((c: any) => c.rating === rating);
    }

    // 2. Lọc theo Search Keyword (Không phân biệt hoa thường)
    if (search) {
      const keyword = search.toLowerCase();
      courses = courses.filter(
        (c: any) =>
          c.title.toLowerCase().includes(keyword) ||
          c.description.toLowerCase().includes(keyword),
      );
    }

    // 3. Phân trang
    const total = courses.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCourses = courses.slice(startIndex, endIndex);

    return NextResponse.json({
      data: paginatedCourses,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Lỗi khi đọc file db.json:", error);
    return NextResponse.json({ data: [], meta: {} }, { status: 500 });
  }
}
