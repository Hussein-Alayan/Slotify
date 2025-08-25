import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export default function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      className="w-full bg-[var(--color-primary)] text-white py-3 rounded-lg font-bold text-base hover:bg-[var(--color-secondary)] hover:text-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-secondary)] transition-all shadow-sm"
      {...props}
    >
      {children}
    </button>
  );
}
