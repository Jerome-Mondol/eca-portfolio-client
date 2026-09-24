"use client";
import React, { createContext, useCallback, useContext, useState } from "react";
import { Check, X, AlertCircle, Info } from "lucide-react";

type Toast = { id: number; title: string; description?: string; variant: "success" | "error" | "info" };
type Ctx = { toast: (t: Omit<Toast, "id">) => void; success: (title: string, desc?: string) => void; error: (title: string, desc?: string) => void; info: (title: string, desc?: string) => void };

const ToastContext = createContext<Ctx | null>(null);
let idCounter = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const toast = useCallback(
    (t: Omit<Toast, "id">) => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { ...t, id }]);
      setTimeout(() => remove(id), 3200);
    },
    [remove]
  );

  const api: Ctx = {
    toast,
    success: (title, description) => toast({ title, description, variant: "success" }),
    error: (title, description) => toast({ title, description, variant: "error" }),
    info: (title, description) => toast({ title, description, variant: "info" }),
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed bottom-4 left-1/2 z-[100] flex w-[calc(100%-24px)] max-w-[420px] -translate-x-1/2 flex-col gap-2 pointer-events-none px-3 sm:px-0 sm:left-auto sm:right-4 sm:translate-x-0 sm:bottom-6">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-xl animate-in slide-in-from-bottom-2 ${
              t.variant === "success"
                ? "bg-[#111827] text-white border-[#1f2937]"
                : t.variant === "error"
                ? "bg-white text-[#991b1b] border-[#fecaca]"
                : "bg-white text-[#1e40af] border-[#bfdbfe]"
            }`}
          >
            <span className={`mt-0.5 h-6 w-6 shrink-0 rounded-full flex items-center justify-center ${t.variant === "success" ? "bg-white/15 text-white" : t.variant === "error" ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"}`}>
              {t.variant === "success" ? <Check size={14} /> : t.variant === "error" ? <X size={14} /> : <Info size={14} />}
            </span>
            <div className="min-w-0 flex-1">
              <p className={`text-sm font-medium leading-tight ${t.variant === "success" ? "text-white" : t.variant === "error" ? "text-[#991b1b]" : "text-[#1e3a8a]"}`}>{t.title}</p>
              {t.description && <p className={`text-xs mt-0.5 leading-4 ${t.variant === "success" ? "text-white/70" : t.variant === "error" ? "text-red-600/80" : "text-blue-700/70"}`}>{t.description}</p>}
            </div>
            <button onClick={() => remove(t.id)} className={`shrink-0 h-7 w-7 rounded-full flex items-center justify-center cursor-pointer ${t.variant === "success" ? "hover:bg-white/10 text-white/60" : "hover:bg-black/5 text-black/40"}`}>
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
