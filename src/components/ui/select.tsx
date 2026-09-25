"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: (string | SelectOption)[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function Select({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  className,
  disabled = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const normalizedOptions: SelectOption[] = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  const selectedOption =
    normalizedOptions.find((opt) => opt.value === value) ||
    (value ? { value, label: value } : null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "Enter" || e.key === " ") {
      if (!isOpen) {
        e.preventDefault();
        setIsOpen(true);
      }
    }
  };

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        className={cn(
          "flex h-11 w-full items-center justify-between rounded-xl border bg-white px-3.5 text-left text-sm text-[#1a1a1e] transition-all cursor-pointer select-none",
          "border-[#e8e8ea] hover:border-[#d0d0d6] hover:bg-[#fcfcfd]",
          "focus:outline-none focus:ring-2 focus:ring-[#111827]/10 focus:border-[#d0d0d6]",
          disabled && "opacity-50 cursor-not-allowed bg-[#f8f8f9]",
          isOpen && "border-[#111827] ring-2 ring-[#111827]/10 bg-white"
        )}
      >
        <span className="truncate flex items-center gap-2.5">
          {selectedOption ? (
            <>
              {selectedOption.icon && <span className="shrink-0 text-[#6b6b76]">{selectedOption.icon}</span>}
              <span className="font-medium text-[#1a1a1e]">{selectedOption.label}</span>
            </>
          ) : (
            <span className="text-[#8a8a94]">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          size={16}
          className={cn(
            "text-[#6b6b76] shrink-0 transition-transform duration-200 ml-2",
            isOpen && "rotate-180 text-[#111827]"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-50 w-full min-w-[180px] rounded-xl border border-[#e8e8ea] bg-white p-1.5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] animate-in fade-in-0 zoom-in-95 duration-100">
          <div className="max-h-60 overflow-y-auto space-y-0.5 scrollbar-thin">
            {normalizedOptions.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition text-left cursor-pointer",
                    isSelected
                      ? "bg-[#111827] text-white font-medium"
                      : "text-[#1a1a1e] hover:bg-[#f3f3f5]"
                  )}
                >
                  <span className="flex items-center gap-2.5 truncate">
                    {option.icon && (
                      <span className={cn("shrink-0", isSelected ? "text-white" : "text-[#6b6b76]")}>
                        {option.icon}
                      </span>
                    )}
                    <span>{option.label}</span>
                  </span>
                  {isSelected && <Check size={14} className="ml-2 shrink-0 text-white" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
