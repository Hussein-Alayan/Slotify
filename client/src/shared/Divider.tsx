import React from "react";

export default function Divider({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex items-center w-full max-w-sm my-6">
      <div className="flex-1 h-px bg-gray-200" />
      {children && (
        <span className="mx-4 text-gray-400 text-sm whitespace-nowrap bg-white px-2">
          {children}
        </span>
      )}
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}
// Duplicate file, remove from src/shared. Use components/shared instead.
