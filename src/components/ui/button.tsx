import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
}

const variantClasses: Record<string, string> = {
  primary: "bg-[#111827] text-white hover:bg-black shadow-sm hover:shadow disabled:opacity-50",
  secondary: "bg-white text-[#111827] border border-[#e8e8ea] hover:bg-[#f8f8f9] shadow-sm",
  ghost: "bg-transparent text-[#111827] hover:bg-[#f3f3f5]",
  outline: "border border-[#111827] text-[#111827] bg-transparent hover:bg-[#111827] hover:text-white",
};

const sizeClasses: Record<string, string> = {
  sm: "h-9 sm:h-8 px-3.5 text-[13px] rounded-full min-h-[36px]",
  md: "h-11 sm:h-10 px-5 text-[14px] rounded-full min-h-[44px]",
  lg: "h-12 px-7 text-[15px] rounded-full min-h-[48px]",
  icon: "h-11 w-11 sm:h-10 sm:w-10 rounded-full",
};

export function Button({ className, variant = "primary", size = "md", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium tracking-tight transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111827] focus-visible:ring-offset-2 disabled:pointer-events-none whitespace-nowrap cursor-pointer disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}
