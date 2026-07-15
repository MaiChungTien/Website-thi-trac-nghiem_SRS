import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, email, password, fullName, mobile, address } = body;

    const dbPath = path.join(process.cwd(), 'db.json');
    const fileData = await fs.readFile(dbPath, 'utf8');
    const db = JSON.parse(fileData);

    // Kiểm tra trùng email
    if (db.users.some((u: any) => u.email === email)) {
      return NextResponse.json({ message: 'Email đã được sử dụng' }, { status: 400 });
    }

    // Tạo user mới (Ép cứng role là 'student' theo yêu cầu)
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password, // Thực tế phải mã hóa hash, đây là mock nên để raw
      fullName,
      mobile,
      address,
      role: 'student' 
    };

    // Ghi vào file
    db.users.push(newUser);
    await fs.writeFile(dbPath, JSON.stringify(db, null, 2));

    const { password: _, ...userInfo } = newUser;
    return NextResponse.json({ message: 'Đăng ký thành công', user: userInfo }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi server' }, { status: 500 });
  }
}