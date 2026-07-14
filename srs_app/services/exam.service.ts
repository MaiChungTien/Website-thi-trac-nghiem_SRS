import type { Exam, ExamResult } from "@/types";

const mockExams: Exam[] = [
  { id: "exam-1", title: "Toán cơ bản", subject: "Toán", durationMinutes: 30, totalQuestions: 20 },
  { id: "exam-2", title: "Tiếng Anh cơ bản", subject: "Tiếng Anh", durationMinutes: 25, totalQuestions: 15 },
];

export async function getExams() {
  return mockExams;
}

export async function getExamResult(id: string): Promise<ExamResult | null> {
  return {
    id,
    examId: id,
    userId: "member-1",
    score: 85,
    submittedAt: new Date().toISOString(),
  };
}
