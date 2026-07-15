"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  isLoggedIn: boolean;
  role?: string;
}

export default function Header({ isLoggedIn, role }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref cho input file ẩn
  const router = useRouter();
  
  const [userData, setUserData] = useState({
    fullName: "Đang tải...",
    email: "",
    mobile: "",
    address: "",
    avatar: "https://i.pravatar.cc/150" 
  });

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetch("/api/users")
        .then(async (res) => {
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || `Lỗi HTTP: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          setUserData({
            fullName: data.fullName || "User",
            email: data.email || "",
            mobile: data.mobile || "",
            address: data.address || "",
            avatar: data.avatar || "https://i.pravatar.cc/150",
          });
        })
        .catch((err) => {
          console.error("Chi tiết lỗi API:", err.message);
          setUserData(prev => ({ ...prev, fullName: "Lỗi tải dữ liệu" }));
        });
    }
  }, [isLoggedIn]);

  // Xử lý gõ text trong form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  // 1. XỬ LÝ UPLOAD AVATAR
  const handleAvatarClick = () => {
    // Kích hoạt click vào thẻ input type="file" đang bị ẩn
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Chuyển ảnh thành chuỗi Base64 để hiển thị và lưu tạm
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 2. XỬ LÝ LƯU THÔNG TIN XUỐNG DB
  const handleSave = async () => {
    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (res.ok) {
        alert("Đã cập nhật thông tin thành công!");
        setIsProfileModalOpen(false); // Đóng modal
      } else {
        alert("Lưu thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      alert("Đã xảy ra lỗi kết nối.");
    }
  };

  // 3. XỬ LÝ ĐĂNG XUẤT
  const handleLogout = () => {
    // Xóa cookie bằng Javascript (Set thời hạn về quá khứ)
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    
    // Đẩy về trang đăng nhập và ép làm mới ứng dụng
    router.push("/");
    router.refresh(); 
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm relative">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="w-12 h-12 rounded-full relative overflow-hidden">
              <Image src={"/images/logo.svg"} alt="Logo" fill sizes="48px" className="object-cover" />
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-primary font-semibold hover:text-secondary">Trang chủ</Link>
            <Link href="/about" className="text-gray-600 font-medium hover:text-primary">Giới thiệu</Link>
            <Link href="/student/courses" className="text-gray-600 font-medium hover:text-primary">Đề thi</Link>
            <Link href="/contact" className="text-gray-600 font-medium hover:text-primary">Liên hệ</Link>
          </nav>

          <div className="flex items-center gap-4">
            <button className="hidden lg:flex items-center gap-2 text-gray-600 hover:text-primary font-medium">
               <span>VI</span>
            </button>
            <div className="h-6 w-px bg-gray-200 hidden lg:block"></div>

            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 hover:border-primary transition-all"
                >
                  <Image src={userData.avatar} alt="Avatar" fill sizes="40px" className="object-cover" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full relative overflow-hidden bg-gray-100">
                         <Image src={userData.avatar} alt="Avatar" fill sizes="48px" className="object-cover" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{userData.fullName}</p>
                        <p className="text-sm text-gray-500">{userData.email}</p>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <button onClick={() => { setIsDropdownOpen(false); setIsProfileModalOpen(true); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 flex justify-between items-center text-gray-700">
                        <span>Hồ Sơ Cá Nhân</span> <span>&rsaquo;</span>
                      </button>
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex justify-between items-center text-gray-700">
                        <span>Cài Đặt</span> <span>&rsaquo;</span>
                      </button>
                      <div className="px-4 py-2 flex justify-between items-center text-gray-700">
                        <span>Thông Báo</span> <span className="text-xs text-blue-500">Allow</span>
                      </div>
                    </div>
                    <div className="py-2 border-t border-gray-100">
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2">
                        <span>Đăng Xuất</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/login" className="text-primary font-medium hover:underline">Đăng nhập</Link>
                <Link href="/auth/register" className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">Đăng ký</Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative shadow-2xl">
            <button onClick={() => setIsProfileModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800">
              &#x2715;
            </button>
            
            <div className="mb-6 font-bold text-xl text-gray-800">Thông Tin Người Dùng</div>

            <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
              <div className="relative w-20 h-20">
                <div className="w-20 h-20 rounded-full overflow-hidden relative bg-gray-100">
                  <Image src={userData.avatar} alt="Avatar" fill sizes="80px" className="object-cover" />
                </div>
                
                {/* Input ẩn để chọn file */}
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden" 
                />
                
                <button 
                  onClick={handleAvatarClick}
                  className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow border border-gray-200 text-gray-600 hover:text-blue-500 z-10"
                >
                  ✎
                </button>
              </div>
              <div>
                <p className="font-bold text-lg text-gray-800">{userData.fullName}</p>
                <p className="text-sm text-gray-500">{userData.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-600 min-w-32">Họ và tên</span>
                <input 
                  type="text" 
                  name="fullName"
                  value={userData.fullName} 
                  onChange={handleInputChange}
                  className="text-right text-gray-800 focus:outline-none focus:border-b focus:border-blue-500 w-full" 
                />
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-600 min-w-32">Email</span>
                <span className="text-gray-800 text-right w-full overflow-hidden text-ellipsis">{userData.email}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-600 min-w-32">Số điện thoại</span>
                <input 
                  type="text" 
                  name="mobile"
                  value={userData.mobile} 
                  onChange={handleInputChange}
                  placeholder="Add number" 
                  className="text-right text-gray-800 focus:outline-none focus:border-b focus:border-blue-500 w-full" 
                />
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-600 min-w-32">Địa chỉ</span>
                <input 
                  type="text" 
                  name="address"
                  value={userData.address} 
                  onChange={handleInputChange}
                  placeholder="Address"
                  className="text-right text-gray-800 focus:outline-none focus:border-b focus:border-blue-500 w-full" 
                />
              </div>
            </div>

            <div className="mt-8">
              <button 
                onClick={handleSave}
                className="bg-blue-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}