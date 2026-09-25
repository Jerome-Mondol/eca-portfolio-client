import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline" | "danger" | "success" | "warning" | string;
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantStyles: Record<string, string> = {
    default: "border-[#e8e8ea] bg-[#f8f8f9] text-[#3f3f46]",
    secondary: "border-[#e4e4e7] bg-[#f4f4f5] text-[#18181b]",
    outline: "border-[#e4e4e7] bg-transparent text-[#71717a]",
    danger: "border-red-200 bg-red-50 text-red-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    warning: "border-amber-200 bg-amber-50 text-amber-700",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-tight transition-colors",
        variantStyles[variant] || variantStyles.default,
        className
      )}
      {...props}
    />
  );
}
