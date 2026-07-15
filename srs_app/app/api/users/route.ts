// app/api/users/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";

// 1. GET: Lấy thông tin user (Code cũ của bạn)
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Chưa xác thực" }, { status: 401 });
    }

    const actualId = token.replace("fake-jwt-token-", "");
    const dbPath = path.join(process.cwd(), "db.json");
    const dbData = fs.readFileSync(dbPath, "utf-8");
    const db = JSON.parse(dbData);

    const currentUser = db.users.find((u: any) => u.id === actualId);

    if (!currentUser) {
      return NextResponse.json(
        { message: "Không tìm thấy người dùng" },
        { status: 404 },
      );
    }

    const { password, ...safeUserData } = currentUser;
    return NextResponse.json(safeUserData, { status: 200 });
  } catch (error) {
    console.error("Lỗi đọc db.json:", error);
    return NextResponse.json({ message: "Lỗi máy chủ" }, { status: 500 });
  }
}

// 2. PUT: Cập nhật thông tin user vào db.json
export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Chưa xác thực" }, { status: 401 });
    }

    const actualId = token.replace("fake-jwt-token-", "");

    // Nhận dữ liệu gửi lên từ form
    const body = await req.json();

    const dbPath = path.join(process.cwd(), "db.json");
    const dbData = fs.readFileSync(dbPath, "utf-8");
    const db = JSON.parse(dbData);

    // Tìm vị trí user trong mảng
    const userIndex = db.users.findIndex((u: any) => u.id === actualId);

    if (userIndex === -1) {
      return NextResponse.json(
        { message: "Không tìm thấy người dùng" },
        { status: 404 },
      );
    }

    // Cập nhật các trường thông tin (không cho phép đổi id, username, email)
    db.users[userIndex] = {
      ...db.users[userIndex],
      fullName: body.fullName || db.users[userIndex].fullName,
      mobile: body.mobile || db.users[userIndex].mobile,
      address: body.address || db.users[userIndex].address,
      avatar: body.avatar || db.users[userIndex].avatar,
    };

    // Ghi đè lại vào file db.json
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf-8");

    return NextResponse.json(
      { message: "Cập nhật thành công" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Lỗi ghi db.json:", error);
    return NextResponse.json({ message: "Lỗi máy chủ" }, { status: 500 });
  }
}
