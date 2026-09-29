import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

type PageHeaderProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

/**
 * Title, subtitle and primary action for a dashboard screen.
 *
 * Server-safe: no state or effects, so it stays usable from either a server or
 * a client parent.
 */
export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted">{description}</p>
      </div>
      {action}
    </div>
  );
}

type AddButtonProps = {
  open: boolean;
  /** Rendered as `＋ Add <label>` while the form is closed. */
  label: string;
  onClick: () => void;
};

/** The `+ Add` / `Cancel` toggle that opens a dashboard form. */
export function AddButton({ open, label, onClick }: AddButtonProps) {
  return (
    <Button
      onClick={onClick}
      aria-expanded={open}
      className="w-full sm:w-auto min-h-[44px] cursor-pointer"
    >
      {open ? "Cancel" : `＋ ${label}`}
    </Button>
  );
}
