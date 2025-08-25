import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export default function Input({ label, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-2">{label}</label>
      )}
      <input
        className="w-full border border-[var(--color-primary)] rounded-lg px-4 py-3 outline-none text-[var(--color-primary)] placeholder:text-[var(--color-primary)] focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)] transition-all text-base"
        {...props}
      />
    </div>
  );
}
