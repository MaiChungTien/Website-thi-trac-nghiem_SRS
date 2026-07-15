export default function Footer() {
  return (
    <footer className="bg-primary-dark pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12 border-b border-white/10 pb-12">
        <div className="col-span-1 md:col-span-2">
           <h2 className="text-white text-2xl font-bold mb-4">SRS Academy</h2>
           <p className="text-gray-300 leading-relaxed max-w-md">
             Nền tảng thi trắc nghiệm trực tuyến hàng đầu dành cho sinh viên, cung cấp bộ đề đa dạng và hệ thống đánh giá năng lực thông minh.
           </p>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-4">Liên kết</h3>
          <ul className="space-y-2 text-gray-300">
            <li><a href="#" className="hover:text-secondary">Trang chủ</a></li>
            <li><a href="#" className="hover:text-secondary">Về chúng tôi</a></li>
            <li><a href="#" className="hover:text-secondary">Khóa học</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-4">Liên hệ</h3>
          <ul className="space-y-2 text-gray-300">
            <li>Email: info@srs.edu.vn</li>
            <li>Hotline: 1900 9999</li>
          </ul>
        </div>
      </div>
      <div className="text-center text-gray-400 text-sm">
        © 2026 SRS Academy - Phát triển bởi Nhóm Sinh viên Bách Khoa
      </div>
    </footer>
  );
}