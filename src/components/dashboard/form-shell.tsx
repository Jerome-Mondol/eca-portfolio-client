import type { FormEvent, ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Collapse } from "@/components/ui/collapse";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type FormShellProps = {
  open: boolean;
  saving: boolean;
  onSubmit: (event: FormEvent) => void;
  submitLabel: string;
  savingLabel: string;
  /** Optional heading above the fields. */
  title?: string;
  /** Renders a cancel button when given — use for forms with their own reset. */
  onCancel?: () => void;
  children: ReactNode;
};

/**
 * The card + expand + submit-button frame every dashboard form sits in.
 *
 * Owning the `Collapse` here means the open/close transition and the busy
 * state are consistent across screens, and each page's form file is left
 * holding only its own fields.
 */
export function FormShell({ open, saving, onSubmit, submitLabel, savingLabel, title, onCancel, children }: FormShellProps) {
  return (
    <Collapse open={open}>
      <Card className="p-5">
        <form onSubmit={onSubmit} className="space-y-4">
          {title && <h3 className="font-semibold text-sm">{title}</h3>}
          {children}
          <div className="flex gap-2 justify-end">
            {onCancel && (
              <Button type="button" variant="secondary" onClick={onCancel} className="cursor-pointer">
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={saving} className="w-full sm:w-auto cursor-pointer min-h-[44px]">
              {saving && <Loader2 size={14} className="mr-2 animate-spin" />}
              {saving ? savingLabel : submitLabel}
            </Button>
          </div>
        </form>
      </Card>
    </Collapse>
  );
}
