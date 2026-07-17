'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface SearchExamBarProps {
  onSearchChange: (term: string) => void;
  placeholder?: string;
  value: string;
}

export function SearchExamBar({ onSearchChange, placeholder = 'Tìm kiếm...', value }: SearchExamBarProps) {
  return (
    <div className="relative flex w-full max-w-xs">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1 min-w-0 bg-white border border-gray-300 rounded-md py-2 px-3 pr-10 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
      </div>
    </div>
  );
}