"use client";

import { useEffect, useState } from "react";
import { verifyProjectLinkApi } from "@/lib/api";

export type VerifyResult = {
  valid: boolean;
  url: string;
  status?: number;
  statusText?: string;
  domain?: string;
  message: string;
};

type State = { verifying: boolean; result: VerifyResult | null };

const IDLE: State = { verifying: false, result: null };

/**
 * Debounced live URL check for the link field.
 *
 * Only URLs that look like hosts are checked, so a half-typed value never
 * triggers a request. The 500ms delay keeps typing from firing a request per
 * keystroke.
 */
export function useLinkVerification(url: string): State {
  const [state, setState] = useState<State>(IDLE);

  useEffect(() => {
    const trimmed = url.trim();
    if (!trimmed || trimmed.length < 4 || !trimmed.includes(".")) {
      setState(IDLE);
      return;
    }

    setState((prev) => ({ verifying: true, result: prev.result }));
    const timer = setTimeout(async () => {
      try {
        const result = await verifyProjectLinkApi(trimmed);
        setState({ verifying: false, result });
      } catch {
        setState({ verifying: false, result: { valid: false, url: trimmed, message: "Could not reach domain" } });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [url]);

  return state;
}
