export interface ExamQuestion {
  id: number;
  question: string;
  options: string[];
  answer: string;
}

export interface Exam {
  id: string;
  title: string;
  questions: ExamQuestion[];
}

export interface CoursePreview {
  id: number;
  title: string;
  description: string;
  exams: number;
  rating: string;
  img: string;
  locked: boolean;
}