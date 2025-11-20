"use client";
import React from "react";
import clsx from "clsx";

export interface InputProps
 extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
 label?: string;
 leftIcon?: React.ReactNode;
 error?: string;
 helperText?: string;
 fieldSize?: "sm" | "md" | "lg";
}

const sizeStyles: Record<string, string> = {
 sm: "h-8 text-xs px-2",
 md: "h-10 text-sm px-3",
 lg: "h-12 text-sm px-4",
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
 (
  {
   label,
   leftIcon,
   error,
   helperText,
   fieldSize = "md",
   className,
   id,
   ...rest
  },
  ref
 ) => {
  return (
   <div className="w-full">
    {label && (
     <label
      htmlFor={id}
      className="block text-sm font-medium text-zinc-300 mb-1"
     >
      {label}
     </label>
    )}
    <div
     className={clsx("relative group", error && "[&>input]:border-red-500")}
    >
     {leftIcon && (
      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
       {leftIcon}
      </span>
     )}
     <input
      id={id}
      ref={ref}
      className={clsx(
       "w-full bg-zinc-700/50 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all",
       leftIcon && "pl-10",
       sizeStyles[fieldSize],
       className
      )}
      aria-invalid={!!error}
      aria-describedby={
       error ? `${id}-error` : helperText ? `${id}-help` : undefined
      }
      {...rest}
     />
    </div>
    {error && (
     <p id={`${id}-error`} className="mt-1 text-xs text-red-400">
      {error}
     </p>
    )}
    {!error && helperText && (
     <p id={`${id}-help`} className="mt-1 text-xs text-zinc-500">
      {helperText}
     </p>
    )}
   </div>
  );
 }
);
Input.displayName = "Input";
