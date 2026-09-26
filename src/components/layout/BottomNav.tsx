"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Plus, Sparkles, LayoutDashboard, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { AddSheet } from "@/components/AddSheet";

const items = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/dashboard/ai", icon: Sparkles, label: "AI" },
  { href: "/dashboard/portfolio", icon: LayoutDashboard, label: "Portfolio" },
  { href: "/dashboard/profile", icon: User, label: "Profile" },
];

export function BottomNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <>
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-[#ececef] bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/90"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-label="Primary mobile navigation"
      >
        <div className="mx-auto max-w-[560px] flex items-center justify-around px-1 py-1">
          {items.slice(0, 1).map((it) => {
            const active = pathname === it.href;
            return (
              <Link
                key={it.href}
                href={it.href}
                prefetch
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl min-w-[56px] min-h-[52px] cursor-pointer",
                  active ? "text-[#111827] bg-[#f6f6f7]" : "text-[#6b6b76] active:bg-[#f3f3f5]"
                )}
              >
                <it.icon size={22} strokeWidth={active ? 2.2 : 1.8} />
                <span className="text-[11px] font-medium leading-none">{it.label}</span>
              </Link>
            );
          })}
          <button
            onClick={() => setOpen(true)}
            className="flex flex-col items-center justify-center gap-1 px-3 py-1 min-w-[64px]"
            aria-label="Add new item"
          >
            <span className="h-12 w-12 rounded-full bg-[#111827] text-white flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.16)] -mt-2 active:scale-95 transition">
              <Plus size={22} strokeWidth={2.2} />
            </span>
            <span className="text-[11px] font-semibold text-[#111827] leading-none">Add</span>
          </button>
          {items.slice(1).map((it) => {
            const active = pathname === it.href;
            return (
              <Link
                key={it.href}
                href={it.href}
                prefetch
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl min-w-[56px] min-h-[52px] cursor-pointer",
                  active ? "text-[#111827] bg-[#f6f6f7]" : "text-[#6b6b76] active:bg-[#f3f3f5]"
                )}
              >
                <it.icon size={22} strokeWidth={active ? 2.2 : 1.8} />
                <span className="text-[11px] font-medium leading-none">{it.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
      <AddSheet open={open} onClose={() => setOpen(false)} />
    </>
  );
}
