"use client";
import { useState, useEffect, useRef } from "react";
import { Calendar, ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  value: string; // YYYY-MM-DD or ""
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
};

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function formatDisplay(value: string) {
  if (!value) return "";
  const d = new Date(value + "T12:00:00");
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function toISO(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function DatePicker({ value, onChange, placeholder = "Select date", disabled, label }: Props) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => {
    const base = value ? new Date(value + "T12:00:00") : new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const d = new Date(value + "T12:00:00");
      if (!isNaN(d.getTime())) setView(new Date(d.getFullYear(), d.getMonth(), 1));
    }
  }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const year = view.getFullYear();
  const month = view.getMonth();

  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const selected = value ? new Date(value + "T12:00:00") : null;
  const todayISO = toISO(new Date());

  const cells: Array<{ day: number; iso: string; muted: boolean; isToday: boolean; isSelected: boolean }> = [];
  for (let i = startOffset - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const iso = toISO(new Date(year, month - 1, d));
    cells.push({ day: d, iso, muted: true, isToday: iso === todayISO, isSelected: iso === value });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = toISO(new Date(year, month, d));
    cells.push({ day: d, iso, muted: false, isToday: iso === todayISO, isSelected: iso === value });
  }
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    const iso = toISO(new Date(year, month + 1, d));
    cells.push({ day: d, iso, muted: true, isToday: iso === todayISO, isSelected: iso === value });
  }

  return (
    <div ref={ref} className="relative">
      {label && <p className="text-[13px] font-medium tracking-tight text-[#1a1a1e] mb-1.5">{label}</p>}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        className={cn(
          "flex h-11 w-full items-center justify-between rounded-xl border bg-white px-3 text-left text-sm transition cursor-pointer",
          "border-[#e8e8ea] hover:border-[#d0d0d6] hover:bg-[#fcfcfd]",
          "focus:outline-none focus:ring-2 focus:ring-[#111827]/10 focus:border-[#d0d0d6]",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#f8f8f9]",
          open && "border-[#111827] ring-2 ring-[#111827]/10 bg-white",
          !value && "text-[#8a8a94]"
        )}
      >
        <span className="flex items-center gap-2 min-w-0">
          <span className="h-7 w-7 rounded-lg bg-[#f8f8f9] border border-[#e8e8ea] flex items-center justify-center shrink-0">
            <CalendarDays size={14} className="text-[#6b6b76]" />
          </span>
          <span className="truncate">{value ? formatDisplay(value) : placeholder}</span>
        </span>
        <Calendar size={14} className="text-[#8a8a94] shrink-0" />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-[300px] rounded-2xl border border-[#e8e8ea] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#f0f0f2] bg-[#fcfcfd]">
            <button type="button" onClick={() => setView(new Date(year, month - 1, 1))} className="h-8 w-8 rounded-full hover:bg-white border border-transparent hover:border-[#e8e8ea] hover:shadow-sm flex items-center justify-center cursor-pointer transition">
              <ChevronLeft size={16} />
            </button>
            <div className="text-center">
              <p className="text-sm font-semibold tracking-tight">{monthNames[month]} {year}</p>
              <p className="text-xs text-[#8a8a94]">Select date</p>
            </div>
            <button type="button" onClick={() => setView(new Date(year, month + 1, 1))} className="h-8 w-8 rounded-full hover:bg-white border border-transparent hover:border-[#e8e8ea] hover:shadow-sm flex items-center justify-center cursor-pointer transition">
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="p-3">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((w) => (
                <div key={w} className="h-7 flex items-center justify-center text-[11px] font-medium text-[#8a8a94] tracking-wide">
                  {w}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {cells.map((c, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onChange(c.iso);
                    setOpen(false);
                  }}
                  className={cn(
                    "h-8 w-8 rounded-full text-xs font-medium flex items-center justify-center transition cursor-pointer",
                    c.muted ? "text-[#c0c0c8] hover:bg-[#f8f8f9]" : "text-[#1a1a1e] hover:bg-[#f3f3f5]",
                    c.isToday && !c.isSelected && "ring-1 ring-[#111827] ring-offset-1",
                    c.isSelected && "bg-[#111827] text-white shadow-sm hover:bg-black"
                  )}
                >
                  {c.day}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between px-3 py-2.5 border-t border-[#f0f0f2] bg-[#fcfcfd]">
            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className="text-xs font-medium text-[#6b6b76] hover:text-[#111827] px-2 py-1 rounded-full hover:bg-white border border-transparent hover:border-[#e8e8ea] cursor-pointer transition"
            >
              Clear
            </button>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  const iso = toISO(new Date());
                  onChange(iso);
                  setView(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
                  setOpen(false);
                }}
                className="text-xs font-medium bg-[#111827] text-white px-3 py-1.5 rounded-full hover:bg-black cursor-pointer transition"
              >
                Today
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
