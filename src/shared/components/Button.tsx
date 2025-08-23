"use client";
import React from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
 variant?: "primary" | "outline" | "ghost";
 size?: "sm" | "md" | "lg";
 loading?: boolean;
 leftIcon?: React.ReactNode;
 rightIcon?: React.ReactNode;
 full?: boolean;
}

const base =
 "inline-flex items-center justify-center font-medium rounded-md transition-all focus-ring disabled:opacity-60 disabled:cursor-not-allowed";
const sizes: Record<string, string> = {
 sm: "text-xs px-2.5 py-1.5",
 md: "text-sm px-4 py-2",
 lg: "text-sm px-5 py-3",
};
const variants: Record<string, string> = {
 primary:
  "bg-[var(--accent)] text-white hover:brightness-110 shadow hover:shadow-md",
 outline:
  "border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)]/10",
 ghost: "text-[var(--accent)] hover:bg-[var(--accent)]/10",
};

export const Button: React.FC<ButtonProps> = ({
 variant = "primary",
 size = "md",
 loading,
 leftIcon,
 rightIcon,
 full,
 className,
 children,
 ...rest
}) => (
 <button
  className={clsx(
   base,
   sizes[size],
   variants[variant],
   full && "w-full",
   loading && "cursor-progress",
   className
  )}
  {...rest}
 >
  {leftIcon && <span className="mr-2 flex items-center">{leftIcon}</span>}
  {loading ? "..." : children}
  {rightIcon && <span className="ml-2 flex items-center">{rightIcon}</span>}
 </button>
);
