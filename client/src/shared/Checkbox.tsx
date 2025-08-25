import React from "react";

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export default function Checkbox({ label, ...props }: CheckboxProps) {
  return (
    <label className="flex items-center text-sm cursor-pointer select-none font-normal">
      <input
        type="checkbox"
        className="mr-2 accent-[var(--color-primary)] rounded"
        {...props}
      />
      {label}
    </label>
  );
}
// Duplicate file, remove from src/shared. Use components/shared instead.
