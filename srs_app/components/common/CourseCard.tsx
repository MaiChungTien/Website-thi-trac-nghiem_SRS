"use client"; 
import Image from "next/image";
import { useRouter } from "next/navigation";

// Bổ sung thêm thuộc tính priority vào interface
interface CourseProps {
  course: {
    id: number;
    title: string;
    description: string;
    exams: string;
    rating: string;
    img: string;
    locked: boolean;
  };
  priority?: boolean; // Tùy chọn ưu tiên tải ảnh
}

// Hàm render sao đánh giá
function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="15" height="15" viewBox="0 0 24 24" fill="#F7A83A">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  );
}

export default function CourseCard({ course, priority = false }: CourseProps) {
  const router = useRouter();
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-[0_0_35px_rgba(231,231,231,0.6)]">
      
      {/* Cập nhật lại cấu hình Image */}
      <div className="relative h-52 w-full overflow-hidden bg-gray-100">
        <Image 
          src={course.img} 
          alt={course.title} 
          fill
          // Sửa 'size' thành 'sizes', và khai báo theo chuẩn responsive
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 390px"
          priority={priority} // Xử lý cảnh báo LCP
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-blue-100/70">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[16px] text-[#f7a83a]">
              {course.rating}
            </span>
            <StarRating />
          </div>
          <span className="font-medium text-[16px] text-[#686868]">
            {course.exams}
          </span>
        </div>

        <h3 className="mb-2 font-bold text-[20px] text-[#444] tracking-wide">
          {course.title}
        </h3>
        <p className="mb-5 text-[16px] text-[#46576b] leading-relaxed line-clamp-3">
          {course.description}
        </p>

        {/* CTA Button */}
        {course.locked ? (
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.push('/auth/login')} 
              className="px-6 py-2.5 rounded-full text-white font-semibold bg-[#f7a83a] text-[18px]"
            >
              Mở khóa đề thi
            </button>
            <span className="font-semibold italic text-[16px] text-[#686868]">Khóa</span>
          </div>
        ) : (
          <button 
            onClick={() => router.push(`/courses/${course.id}`)} 
            className="px-6 py-2.5 rounded-full text-white font-semibold bg-[#2cc302] text-[18px]"
          >
            Làm bài thi
          </button>
        )}
      </div>
    </div>
  );
}