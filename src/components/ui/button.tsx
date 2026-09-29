import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
}

const variantClasses: Record<string, string> = {
  // Deep coral gradient, not the flat #FF7F50: white on #FF7F50 is only
  // 2.5:1. The gradient keeps the lightest stop at #C2410C (5.2:1).
  primary:
    "bg-[linear-gradient(180deg,var(--primary-strong),var(--primary-strong-hover))] text-primary-foreground shadow-sm hover:shadow-md hover:brightness-[1.06] active:brightness-95 disabled:opacity-50",
  secondary: "bg-card text-foreground border border-border hover:bg-surface-2 shadow-sm",
  ghost: "bg-transparent text-foreground hover:bg-surface-2",
  outline: "border border-primary-strong text-primary-strong bg-transparent hover:bg-primary-strong hover:text-primary-foreground",
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
        "inline-flex items-center justify-center font-medium tracking-tight transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-strong focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none whitespace-nowrap cursor-pointer disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}
