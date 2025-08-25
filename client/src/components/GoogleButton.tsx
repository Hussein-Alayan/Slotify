import React from "react";

export default function GoogleButton() {
  return (
    <button className="w-full max-w-sm border border-[var(--color-primary)] rounded py-3 flex items-center justify-center font-semibold text-[var(--color-primary)] mb-6 text-base hover:bg-[var(--color-secondary)] transition-colors">
      <span className="mr-2 bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center text-lg">
        G
      </span>
    </button>
  );
}
