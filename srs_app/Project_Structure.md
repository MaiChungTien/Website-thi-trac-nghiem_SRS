# Project Structure

This document describes the current folder structure of the SRS exam website project.

## 1. Root Structure

- app/: Next.js App Router pages, layouts, and API routes
- components/: Reusable UI components grouped by feature and role
- services/: API and business logic for authentication and exams
- lib/: Shared client/configuration helpers
- types/: TypeScript types and interfaces
- utils/: Utility helpers such as validation logic
- public/: Static assets and images
- middleware.ts: Route middleware / auth-related handling
- db.json: Local mock data source used by the application
- package.json, package-lock.json, pnpm-lock.yaml, pnpm-workspace.yaml: Dependency and workspace configuration
- next.config.ts, tsconfig.json, postcss.config.mjs, eslint.config.mjs, next-env.d.ts: Framework and tooling configuration

## 2. App Router Structure

### Public pages
- app/page.tsx: Landing/home page
- app/layout.tsx: Global application layout
- app/globals.css: Global styles
- app/auth/login/page.tsx: Login page
- app/auth/register/page.tsx: Registration page

### Student area
- app/(student)/layout.tsx: Shared layout for student pages
- app/(student)/student/dashboard/page.tsx: Student dashboard
- app/(student)/student/courses/page.tsx: Course/exam list page
- app/(student)/student/exams/page.tsx: Student exams overview
- app/(student)/student/exams/[examId]/page.tsx: Exam-taking page
- app/(student)/student/profile/page.tsx: Student profile page
- app/(student)/results/[resultId]/page.tsx: Exam result detail page

### Admin area
- app/(admin)/layout.tsx: Shared layout for admin pages
- app/(admin)/dashboard/page.tsx: Admin dashboard
- app/(admin)/users/page.tsx: User management page
- app/(admin)/exams/page.tsx: Exam management page
- app/(admin)/reports/page.tsx: Reports and analytics page

### API routes
- app/api/auth/route.ts: Authentication API handler
- app/api/auth/login/route.ts: Login endpoint
- app/api/auth/register/route.ts: Register endpoint
- app/api/courses/route.ts: Courses API endpoint
- app/api/users/route.ts: Users API endpoint

### UI helpers
- app/ui/skeletons.tsx: Reusable loading skeleton components

## 3. Components

### Common components
- components/common/Button.tsx: Reusable button component
- components/common/CourseCard.tsx: Course card UI
- components/common/CoursesSection.tsx: Course listing section
- components/common/Footer.tsx: Footer UI
- components/common/Header.tsx: Header UI
- components/common/HeroSection.tsx: Hero section UI

### Admin components
- components/admin/Sidebar.tsx: Admin sidebar navigation

### Student components
- components/student/StudentNavbar.tsx: Student top navigation
- components/student/StudentSidebar.tsx: Student sidebar navigation

## 4. Services and Logic

- services/auth.service.ts: Authentication-related logic
- services/exam.service.ts: Exam and result data logic

## 5. Shared Helpers

- lib/axios.ts: Base API client setup
- utils/validation.ts: Validation helpers for forms
- types/index.ts: Core domain types used across the app

## 6. Architecture Overview

The project currently follows a modular Next.js structure:

1. app/ handles routing, layouts, and API endpoints
2. components/ contains UI building blocks grouped by feature
3. services/ centralizes data access and business logic
4. types/ and utils/ provide shared typing and validation helpers

This organization makes it easier to extend the platform with new role-based pages and features.
