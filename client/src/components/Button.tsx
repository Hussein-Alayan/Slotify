import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export default function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      className="w-full bg-[var(--color-primary)] text-white py-2 rounded font-semibold hover:bg-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors"
      {...props}
    >
      {children}
    </button>
  );
}
