/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**', // Cho phép tất cả các đường dẫn từ domain này
      },
      // Bổ sung sẵn các domain thật nếu bạn đã biết (ví dụ: cloudinary, s3...)
      // {
      //   protocol: 'https',
      //   hostname: 'res.cloudinary.com',
      // },
    ],
  },
};

export default nextConfig; // (Dùng module.exports = nextConfig nếu là file .js dạng CommonJS)