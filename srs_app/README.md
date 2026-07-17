This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## API calls & data fetching

### Courses API
**Endpoint:** `GET /api/courses`

**Query Parameters:**
- `rating` (string): Filter courses by rating (e.g., "5", "4", etc.)
- `search` (string): Search courses by title or description (case-insensitive)
- `page` (number, default: 1): Page number for pagination
- `limit` (number, default: 8): Number of items per page

**Response Format:**
```json
{
  "data": [
    {
      "id": number,
      "title": string,
      "description": string,
      "exams": number,
      "rating": string,
      "img": string,
      "locked": boolean
    }
  ],
  "meta": {
    "total": number,
    "page": number,
    "limit": number,
    "totalPages": number
  }
}
```

**Example Usage:**
```typescript
// Get all courses
const response = await fetch('/api/courses');
// => { data: [...], meta: {...} }

// Search for math courses
const response = await fetch('/api/courses?search=math');
// => { data: [...], meta: {...} }

// Get courses with rating 5, page 2, limit 5
const response = await fetch('/api/courses?rating=5&page=2&limit=5');
// => { data: [...], meta: {...} }
```

### Exams API
**Endpoint:** `GET /api/exams`

**Query Parameters:**
- `id` (string): Filter by specific exam ID (exact match)
- `courseId` (number): Filter by course ID (maps to course prefixes)
- `title` or `search` (string): Search exams by title (case-insensitive)
  - Note: If `id` is provided, other filters are ignored

**Course ID to Exam Prefix Mapping:**
- Course ID 1 (Toán học): math
- Course ID 2 (Hóa học): chem
- Course ID 3 (Vật Lý): phys
- Course ID 4 (Lịch sử): history
- Course ID 5 (Địa lý): geo
- Course ID 6 (Sinh học): biology
- Course ID 7 (Tiếng Anh): eng
- Course ID 8 (Lập trình): programming
- Course ID 9 (Văn học): literature
- Course ID 10 (GDCD): gdcd
- Course ID 11 (Tiếng Pháp): french
- Course ID 12 (Khoa học tổng hợp): science

**Response Format:**
```json
{
  "data": [
    {
      "id": string,
      "title": string,
      "questions": [
        {
          "id": number,
          "question": string,
          "options": string[],
          "answer": string
        }
      ]
    }
  ]
}
```

**Example Usage:**
```typescript
// Get all exams
const response = await fetch('/api/exams');
// => { data: [...] }

// Get exams for Toán học course (courseId = 1)
const response = await fetch('/api/exams?courseId=1');
// => { data: [...] }

// Search for exams with title containing "phép tính"
const response = await fetch('/api/exams?search=phép tính');
// => { data: [...] }

// Get specific exam by ID
const response = await fetch('/api/exams?id=math-1');
// => { data: [...] }
```

### Data Fetching Best Practices for Student Pages

1. **Using `fetch` in Server Components:**
```typescript
// app/student/page.tsx
export default async function StudentPage() {
  const coursesRes = await fetch('/api/courses?limit=6');
  const { data: courses } = await coursesRes.json();
  
  const examsRes = await fetch('/api/exams?courseId=1'); // Toán học
  const { data: exams } = await examsRes.json();
  
  return (
    <div>
      <h1>Student Dashboard</h1>
      <CoursesList courses={courses} />
      <ExamsList exams={exams} />
    </div>
  );
}
```

2. **Using `fetch` in Client Components with SWR or React Query:**
```typescript
'use client';

import useSWR from 'swr';

function Courses() {
  const fetcher = (url: string) => fetch(url).then(res => res.json());
  const { data, error, isLoading } = useSWR('/api/courses?limit=8', fetcher);
  
  if (error) return <div>Failed to load</div>;
  if (isLoading) return <div>Loading...</div>;
  return <CoursesList courses={data.data} />;
}
```

3. **Error Handling:**
```typescript
try {
  const response = await fetch('/api/courses');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  // Process data
} catch (error) {
  console.error('Failed to fetch courses:', error);
  // Show error UI
}
```

4. **Pagination Example:**
```typescript
async function fetchCourses(page = 1, limit = 8) {
  const response = await fetch(`/api/courses?page=${page}&limit=${limit}`);
  const { data, meta } = await response.json();
  return { courses: data, pagination: meta };
}
```