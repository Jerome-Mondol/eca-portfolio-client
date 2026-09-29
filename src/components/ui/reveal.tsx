"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** ms to wait after entering the viewport, for staggering siblings. */
  delay?: number;
  /** px the element starts below its final position. */
  y?: number;
  className?: string;
  id?: string;
};

/**
 * Reveals its children once they scroll into view.
 *
 * Offset and stagger are per-instance inline styles rather than a shared class,
 * so `delay`/`y` can be computed inline in a `.map()`. Only `opacity` and
 * `transform` are touched, so the transition stays on the compositor and no
 * layout is shifted.
 *
 * Reduced-motion users and browsers without IntersectionObserver get the
 * content immediately — the hidden start state only exists when the animation
 * will actually run. `data-reveal` is the hook the no-JS fallback in
 * app/layout.tsx uses to force everything visible.
 */
export function Reveal({ children, delay = 0, y = 28, className = "", id }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      // Fire slightly before the element is fully on screen so the motion reads
      // as one continuous pass rather than starting after it has settled.
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      id={id}
      data-reveal=""
      className={className}
      style={
        {
          opacity: shown ? 1 : 0,
          transform: shown ? "translate3d(0,0,0)" : `translate3d(0,${y}px,0)`,
          transition: shown
            ? `opacity 700ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 700ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`
            : "none",
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
