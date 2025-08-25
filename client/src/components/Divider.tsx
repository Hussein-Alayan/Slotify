import React from "react";

export default function Divider({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex items-center w-full max-w-sm my-8">
      <div className="flex-1 h-px bg-gray-200" />
      {children && (
        <span className="mx-2 text-gray-400 text-sm">{children}</span>
      )}
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}
