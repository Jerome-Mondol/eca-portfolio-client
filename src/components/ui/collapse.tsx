"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

type CollapseProps = {
  open: boolean;
  children: ReactNode;
  className?: string;
  /** ms for the height/opacity transition. Also how long the node lingers on close. */
  duration?: number;
};

/**
 * Expands and collapses inline content with a height + fade transition.
 *
 * Height animates via `grid-template-rows: 0fr -> 1fr`, which is the only way
 * to transition to/from an intrinsic (`auto`) height in CSS. The child needs
 * `overflow-hidden` + `min-h-0` for the row to actually collapse to nothing.
 *
 * On close the node stays mounted for the length of the transition, otherwise
 * React would unmount it immediately and the animation would never be seen.
 */
export function Collapse({ open, children, className = "", duration = 340 }: CollapseProps) {
  const [present, setPresent] = useState(open);

  useEffect(() => {
    if (open) {
      setPresent(true);
      return;
    }
    const timer = window.setTimeout(() => setPresent(false), duration);
    return () => window.clearTimeout(timer);
  }, [open, duration]);

  if (!present) return null;

  const timing = `opacity ${duration}ms cubic-bezier(0.22,1,0.36,1), transform ${duration}ms cubic-bezier(0.22,1,0.36,1)`;

  return (
    <div
      className={className}
      style={
        {
          display: "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: `grid-template-rows ${duration}ms cubic-bezier(0.22,1,0.36,1)`,
        } as CSSProperties
      }
    >
      <div className="overflow-hidden min-h-0">
        <div
          style={
            {
              opacity: open ? 1 : 0,
              transform: open ? "translateY(0)" : "translateY(-10px)",
              transition: timing,
            } as CSSProperties
          }
        >
          {children}
        </div>
      </div>
    </div>
  );
}
