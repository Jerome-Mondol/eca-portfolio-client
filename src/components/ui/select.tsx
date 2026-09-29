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
          "flex h-11 w-full items-center justify-between rounded-xl border bg-card px-3.5 text-left text-sm text-foreground transition-all cursor-pointer select-none",
          "border-border hover:border-border-strong hover:bg-card",
          "focus:outline-none focus:ring-2 focus:ring-primary-strong/10 focus:border-border-strong",
          disabled && "opacity-50 cursor-not-allowed bg-surface-2",
          isOpen && "border-primary-strong ring-2 ring-primary-strong/10 bg-card"
        )}
      >
        <span className="truncate flex items-center gap-2.5">
          {selectedOption ? (
            <>
              {selectedOption.icon && <span className="shrink-0 text-muted">{selectedOption.icon}</span>}
              <span className="font-medium text-foreground">{selectedOption.label}</span>
            </>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          size={16}
          className={cn(
            "text-muted shrink-0 transition-transform duration-200 ml-2",
            isOpen && "rotate-180 text-foreground"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-50 w-full min-w-[180px] rounded-xl border border-border bg-card p-1.5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] animate-in fade-in-0 zoom-in-95 duration-100">
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
                      ? "bg-primary-strong text-white font-medium"
                      : "text-foreground hover:bg-surface-2"
                  )}
                >
                  <span className="flex items-center gap-2.5 truncate">
                    {option.icon && (
                      <span className={cn("shrink-0", isSelected ? "text-white" : "text-muted")}>
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
