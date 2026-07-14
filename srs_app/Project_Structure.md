# Project Structure

This document describes the folder structure of the Website Thi Trắc Nghiệm SRS project.

## 1. Root Structure

- app/: Main application routes and pages using Next.js App Router
- components/: Reusable UI components grouped by role
- services/: Business logic and data fetching logic
- lib/: Shared library/configuration helpers
- types/: TypeScript types and interfaces
- utils/: Utility functions such as validation helpers
- public/: Static assets
- package.json: Project dependencies and scripts
- tsconfig.json: TypeScript configuration
- next.config.ts: Next.js configuration

## 2. App Router Structure

### Public pages
- app/page.tsx: Landing page
- app/auth/login/page.tsx: Login page
- app/auth/register/page.tsx: Register page

### Student area
- app/(student)/layout.tsx: Shared layout for student pages
- app/(student)/courses/page.tsx: Exam list page
- app/(student)/profile/page.tsx: User profile page
- app/(student)/exams/[examId]/page.tsx: Exam-taking page
- app/(student)/results/[resultId]/page.tsx: Exam result page

### Admin area
- app/(admin)/layout.tsx: Shared layout for admin pages
- app/(admin)/dashboard/page.tsx: Admin dashboard
- app/(admin)/users/page.tsx: User management
- app/(admin)/exams/page.tsx: Exam management
- app/(admin)/reports/page.tsx: Statistics and reports

### API routes
- app/api/auth/route.ts: Authentication API endpoint
- app/api/users/route.ts: User API endpoint

## 3. Components

### Common components
- components/common/Button.tsx: Reusable button component

### Admin components
- components/admin/Sidebar.tsx: Admin sidebar navigation

### Student components
- components/student/StudentNavbar.tsx: Student top navigation

## 4. Services and Logic

- services/auth.service.ts: Authentication-related logic
- services/exam.service.ts: Exam and result data logic

## 5. Shared Helpers

- lib/axios.ts: Base API client setup
- utils/validation.ts: Validation helpers for forms
- types/index.ts: Core domain types like User, Exam, and ExamResult

## 6. Architecture Overview

The project follows a modular structure:

1. app/ handles routing and page rendering
2. components/ contains UI elements
3. services/ contains business logic and API interaction
4. types/ and utils/ support type safety and reusable helpers

This structure makes the project easier to extend as the exam platform grows.
