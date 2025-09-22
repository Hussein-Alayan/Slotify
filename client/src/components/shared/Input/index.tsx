import React from "react";
import "./styles.css";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export default function Input({ label, id, ...props }: InputProps) {
  // Generate a unique ID if not provided
  const generatedId = React.useId();
  const inputId = id || generatedId;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium mb-2">
          {label}
        </label>
      )}
      <input id={inputId} className="slotify-input" {...props} />
    </div>
  );
}
