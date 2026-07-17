'use client';

import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import type { Exam, ExamQuestion } from '@/components/common/definitions';
import type { Course } from '@/components/admin/admin-dashboard-types';
import { courseExamPrefixMap } from '@/lib/courseMappings';

interface ExamFormProps {
  exam?: Exam; // if undefined, we are creating a new exam
  onSave: (exam: Exam, isNew: boolean) => Promise<void>;
  onClose: () => void;
  idPrefix?: string; // optional prefix to use for generating id when creating a new exam
  courses?: Course[]; // list of available courses for selection (when creating new exam)
}

export function ExamForm({ exam, onSave, onClose, idPrefix, courses }: ExamFormProps) {
  const [formExam, setFormExam] = useState<Exam>(() => {
    if (exam) {
      // Deep copy
      return JSON.parse(JSON.stringify(exam));
    }
    return {
      id: '', // will be set on save if empty
      title: '',
      questions: []
    };
  });

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);

  // When editing an existing exam, try to determine its course from the ID prefix
  useEffect(() => {
    if (exam && courses) {
      // Find which course this exam belongs to based on ID prefix
      const course = courses.find(c => {
        // Convert course.id to number for comparison with courseExamPrefixMap keys
        const courseId = typeof c.id === 'string' ? parseInt(c.id, 10) : c.id;
        const prefixes = courseExamPrefixMap[courseId] || [];
        return prefixes.some(prefix => exam.id.startsWith(prefix));
      });
      setSelectedCourse(course || null);
    }
  }, [exam, courses]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormExam(prev => ({ ...prev, title: e.target.value }));
  };

  const addQuestion = () => {
    const newQuestion: ExamQuestion = {
      id: Date.now() + Math.random(), // temporary ID
      question: '',
      options: ['', '', '', ''],
      answer: ''
    };
    setFormExam(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const removeQuestion = (index: number) => {
    setFormExam(prev => {
      const newArr = [...prev.questions];
      newArr.splice(index, 1);
      return { ...prev, questions: newArr };
    });
  };

  const handleQuestionChange = (qIndex: number, event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { value } = event.target;
    setFormExam(prev => {
      const questions = [...prev.questions];
      questions[qIndex] = { ...questions[qIndex], question: value };
      return { ...prev, questions };
    });
  };

  const handleOptionChange = (qIndex: number, optionIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setFormExam(prev => {
      const questions = [...prev.questions];
      const options = [...questions[qIndex].options];
      options[optionIndex] = value;
      questions[qIndex] = { ...questions[qIndex], options };
      return { ...prev, questions };
    });
  };

  const handleAnswerChange = (qIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setFormExam(prev => {
      const questions = [...prev.questions];
      questions[qIndex] = { ...questions[qIndex], answer: value };
      return { ...prev, questions };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formExam.title.trim()) {
      toast.error('Vui lòng nhập tiêu đề đề thi');
      return;
    }
    // Validate questions
    const validQuestions = formExam.questions.every(q =>
      q.question.trim() &&
      q.options.every(opt => opt.trim()) &&
      q.answer.trim()
    );
    if (!validQuestions) {
      toast.error('Vui lòng điền đầy đủ thông tin cho mỗi câu hỏi (nội dung, 4 pilihan, đáp án)');
      return;
    }
    // Ensure id is set for new exams
    const examToSave = { ...formExam };
    const isNew = !exam; // true if we are creating a new exam
    if (isNew && !examToSave.id.trim()) {
      let prefixToUse = idPrefix; // Start with the passed-in prefix

      // If we have a selected course, use its prefix instead
      if (selectedCourse && courses) {
        // Convert selectedCourse.id to number for lookup in courseExamPrefixMap
        const courseId = typeof selectedCourse.id === 'string' ? parseInt(selectedCourse.id, 10) : selectedCourse.id;
        const coursePrefixes = courseExamPrefixMap[courseId] || [];
        if (coursePrefixes.length > 0) {
          prefixToUse = coursePrefixes[0]; // Use the first prefix for the course
        }
      }

      if (prefixToUse) {
        // Use the provided prefix to generate an ID
        examToSave.id = `${prefixToUse}-${Date.now()}`;
      } else {
        // Generate a random ID without prefix (for global exam list)
        examToSave.id = `exam-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      }
    }
    setLoading(true);
    try {
      await onSave(examToSave, isNew);
      onClose();
      toast.success(isNew ? 'Đề thi đã được thêm thành công!' : 'Đề thi đã được cập nhật thành công!');
    } catch (err: any) {
      toast.error(`Lỗi: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {exam ? 'Chỉnh sửa đề thi' : 'Thêm đề thi mới'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề đề thi
            </label>
            <input
              type="text"
              value={formExam.title}
              onChange={handleTitleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Course Selection (only for new exams) */}
          {!exam && courses && courses.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Môn học
              </label>
              <select
                value={selectedCourse ? String(typeof selectedCourse.id === 'string' ? parseInt(selectedCourse.id, 10) : selectedCourse.id) : ''}
                onChange={(e) => {
                  const courseId = Number(e.target.value);
                  const course = courses.find(c => {
                    // Convert course.id to number for comparison
                    const id = typeof c.id === 'string' ? parseInt(c.id, 10) : c.id;
                    return id === courseId;
                  });
                  setSelectedCourse(course || null);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">-- Chọn môn học --</option>
                {courses.map(course => (
                  <option key={course.id} value={typeof course.id === 'string' ? parseInt(course.id, 10) : course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Câu hỏi ({formExam.questions.length})
            </label>
            <div className="space-y-4">
              {formExam.questions.map((q, qIndex) => (
                <div key={q.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium">Câu hỏi {qIndex + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIndex)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Xóa
                    </button>
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nội dung câu hỏi
                    </label>
                    <textarea
                      value={q.question}
                      onChange={e => handleQuestionChange(qIndex, e)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    {q.options.map((opt, optIndex) => (
                      <div key={optIndex} className="flex items-center space-x-2">
                        <span className="flex-shrink-0 text-gray-500">
                          {String.fromCharCode(65 + optIndex)}.
                        </span>
                        <input
                          type="text"
                          value={opt}
                          onChange={e => handleOptionChange(qIndex, optIndex, e)}
                          placeholder={`Lựa chọn ${String.fromCharCode(65 + optIndex)}`}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Đáp án (A, B, C, D)
                    </label>
                    <input
                      type="text"
                      maxLength={1}
                      value={q.answer.toUpperCase()}
                      onChange={e => {
                        const val = e.target.value.toUpperCase();
                        if (['A', 'B', 'C', 'D'].includes(val)) {
                          handleAnswerChange(qIndex, e);
                        }
                      }}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addQuestion}
              className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              <span className="mr-2">+</span> Thêm câu hỏi
            </button>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 ${loading
                ? 'cursor-not-allowed'
                : ''}`}
            >
              {loading ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}