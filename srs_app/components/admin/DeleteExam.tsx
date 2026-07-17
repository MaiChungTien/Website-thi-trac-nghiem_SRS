'use client';

import { toast } from 'react-toastify';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface DeleteExamProps {
  examId: string;
  examTitle: string;
  isDeleting: boolean;
  onDelete: (id: string) => Promise<void>;
}

export function DeleteExam({ examId, examTitle, isDeleting, onDelete }: DeleteExamProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleConfirm = async () => {
    setConfirmOpen(false);
    try {
      await onDelete(examId);
    } catch (err: any) {
      toast.error(`Failed to delete exam: ${err.message}`);
    }
  };

  return (
    <>
      <button
        onClick={() => setConfirmOpen(true)}
        disabled={isDeleting}
        className="text-sm font-medium text-red-600 hover:text-red-500"
      >
        {isDeleting ? (
          <span className="mr-2">Đang xóa...</span>
        ) : (
          <>
            <TrashIcon className="w-5 h-5 mr-1" />
          </>
        )}
      </button>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-xl relative">
            <h3 className="text-lg font-semibold mb-4">Xác nhận xóa</h3>
            <p className="mb-6">
              Bạn có chắc chắn muốn xóa đề thi "${examTitle}"?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}