import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[#e8e8ea] bg-[#f8f8f9] px-2.5 py-1 text-xs font-medium tracking-tight text-[#3f3f46]",
        className
      )}
      {...props}
    />
  );
}
