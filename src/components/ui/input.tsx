import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "flex h-11 sm:h-10 w-full rounded-xl border border-border bg-card px-3 py-2 text-[16px] sm:text-[14px] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-strong/10 focus:border-border-strong transition",
        className
      )}
      {...props}
    />
  );
}

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("text-[13px] font-medium tracking-tight text-foreground", className)} {...props} />;
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "flex min-h-[88px] w-full rounded-xl border border-border bg-card px-3 py-2.5 text-[16px] sm:text-[14px] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-strong/10 focus:border-border-strong transition",
        className
      )}
      {...props}
    />
  );
}
