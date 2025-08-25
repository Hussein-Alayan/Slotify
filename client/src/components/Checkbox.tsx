import React from "react";

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export default function Checkbox({ label, ...props }: CheckboxProps) {
  return (
    <label className="flex items-center text-sm cursor-pointer select-none">
      <input
        type="checkbox"
        className="mr-2 accent-[var(--color-primary)]"
        {...props}
      />
      {label}
    </label>
  );
}
