import React from "react";

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export default function Checkbox({ label, ...props }: CheckboxProps) {
  return (
    <label className="flex items-center gap-2 text-base font-medium text-[var(--color-primary)] cursor-pointer select-none">
      <input
        type="checkbox"
        className="w-4 h-4 accent-[var(--color-primary)] border-2 border-[var(--color-primary)] rounded focus:ring-2 focus:ring-[var(--color-secondary)] transition-all"
        {...props}
      />
      {label}
    </label>
  );
}
