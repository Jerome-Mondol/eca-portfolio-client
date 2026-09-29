"use client";

import { useCallback } from "react";
import { useToast } from "@/components/ui/toast";
import { useConfirm } from "@/components/ui/confirm-dialog";

type DeleteOptions = {
  title: string;
  description: string;
  run: () => Promise<unknown>;
};

/**
 * Confirm-then-delete, with toast feedback.
 *
 * All six list screens need the same three steps and the same wording, so the
 * dialog and error handling live here rather than in each page.
 */
export function useDeleteResource() {
  const { success, error } = useToast();
  const { confirm } = useConfirm();

  return useCallback(
    async ({ title, description, run }: DeleteOptions) => {
      const confirmed = await confirm({ title, description, confirmText: "Delete", variant: "danger" });
      if (!confirmed) return;
      try {
        await run();
        success("Deleted");
      } catch (err) {
        error("Delete failed", err instanceof Error ? err.message : String(err));
      }
    },
    [confirm, error, success]
  );
}
