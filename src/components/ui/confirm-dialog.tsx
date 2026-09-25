"use client";

import { useState, createContext, useContext, ReactNode } from "react";
import { Button } from "./button";
import { AlertTriangle, Loader2 } from "lucide-react";

interface ConfirmOptions {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "default";
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | null>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({});
  const [resolver, setResolver] = useState<{ resolve: (val: boolean) => void } | null>(null);

  const confirm = (opts: ConfirmOptions): Promise<boolean> => {
    setOptions(opts);
    setIsOpen(true);
    return new Promise((resolve) => {
      setResolver({ resolve });
    });
  };

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      resolver?.resolve(true);
      setIsOpen(false);
      setLoading(false);
    }, 150);
  };

  const handleCancel = () => {
    resolver?.resolve(false);
    setIsOpen(false);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-150">
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-[#e8e8ea] space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <h3 className="text-base font-semibold text-[#111827]">
                  {options.title || "Are you sure?"}
                </h3>
                <p className="text-sm text-[#6b6b76] leading-relaxed">
                  {options.description || "This action cannot be undone."}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#f0f0f2]">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleCancel}
                disabled={loading}
                className="cursor-pointer font-medium min-h-[38px] px-4"
              >
                {options.cancelText || "Cancel"}
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleConfirm}
                disabled={loading}
                className="cursor-pointer font-medium bg-red-600 hover:bg-red-700 text-white min-h-[38px] px-4 border-none shadow-sm"
              >
                {loading && <Loader2 size={14} className="mr-1.5 animate-spin" />}
                {options.confirmText || "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmProvider");
  }
  return context;
}
