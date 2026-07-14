export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: "guest" | "member" | "admin";
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  durationMinutes: number;
  totalQuestions: number;
}

export interface ExamResult {
  id: string;
  examId: string;
  userId: string;
  score: number;
  submittedAt: string;
}
