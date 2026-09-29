"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * The date picker is browser-only and only needed once a form is open, so it
 * stays out of the initial bundle. `ssr: false` requires a client module —
 * hence the directive here rather than on the page.
 */
const DatePicker = dynamic(() => import("@/components/ui/date-picker").then((m) => m.DatePicker), {
  ssr: false,
  loading: () => <Skeleton className="h-[42px] w-full mt-1.5" />,
});

type DateFieldProps = {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
  disabled?: boolean;
};

export function DateField({ value, onChange, label, placeholder, disabled }: DateFieldProps) {
  return (
    <DatePicker
      value={value}
      onChange={onChange}
      label={label}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
}
