'use client';

import { PencilIcon } from '@heroicons/react/24/outline';

interface EditExamProps {
  onClick: () => void;
}

export function EditExam({ onClick }: EditExamProps) {
  return (
    <button
      onClick={(e) => {
        onClick();
        e.stopPropagation();
      }}
      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
    >
      <PencilIcon className="w-5 h-5 mr-1" />
    </button>
  );
}