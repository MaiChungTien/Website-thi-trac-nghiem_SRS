import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Đọc file db.json
    const dbPath = path.join(process.cwd(), "db.json");
    const fileData = await fs.readFile(dbPath, "utf8");
    const db = JSON.parse(fileData);

    // Tìm user
    const user = db.users.find(
      (u: any) => u.email === email && u.password === password,
    );

    if (!user) {
      return NextResponse.json(
        { message: "Email hoặc mật khẩu không đúng" },
        { status: 401 },
      );
    }

    // Loại bỏ password trước khi trả về client
    const { password: _, ...userInfo } = user;

    return NextResponse.json({
      message: "Đăng nhập thành công",
      user: userInfo,
      token: `fake-jwt-token-${userInfo.id}`, // Token giả
    });
  } catch (error) {
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
