"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#ececef] bg-white/85 backdrop-blur-xl supports-[backdrop-filter]:bg-white/75">
      <div className="mx-auto flex h-[56px] max-w-[1120px] items-center justify-between px-3 sm:px-6 gap-2">
        <Link href="/" className="flex items-center gap-2 min-h-[44px] shrink-0">
          <div className="h-7 w-7 rounded-lg bg-[#111827] flex items-center justify-center text-white text-[13px] font-bold tracking-tighter shrink-0">◈</div>
          <span className="text-[15px] font-semibold tracking-tight">folio</span>
          <span className="hidden sm:inline text-[11px] font-medium text-[#0f766e] bg-[#ecfdf5] border border-[#a7f3d0] rounded-full px-2 py-0.5 ml-1">ECA Showcase • Educational</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-[13.5px] font-medium text-[#3f3f46]">
          <a href="#how" className="hover:text-[#111827] transition min-h-[44px] flex items-center">
            How it works
          </a>
          <a href="#features" className="hover:text-[#111827] transition min-h-[44px] flex items-center">
            Features
          </a>
          <a href="#portfolio" className="hover:text-[#111827] transition min-h-[44px] flex items-center">
            Example
          </a>
          <a href="#ai" className="hover:text-[#111827] transition min-h-[44px] flex items-center">
            AI
          </a>
        </nav>

        <div className="hidden md:flex items-center gap-2 shrink-0">
          <Link href="/login" className="text-[14px] font-medium px-4 min-h-[44px] flex items-center hover:bg-[#f3f3f5] rounded-full transition">
            Log in
          </Link>
          <Link href="/register">
            <Button size="md" className="min-h-[44px]">
              Showcase your ECA
            </Button>
          </Link>
        </div>

        <button
          className="md:hidden h-11 w-11 shrink-0 inline-flex items-center justify-center rounded-full border border-[#e8e8ea] bg-white active:bg-[#f3f3f5] transition"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-[#ececef] bg-white px-3 py-3 space-y-1">
          <a href="#how" className="flex items-center min-h-[44px] text-sm font-medium px-3 rounded-xl hover:bg-[#f8f8f9]" onClick={() => setOpen(false)}>
            How it works
          </a>
          <a href="#features" className="flex items-center min-h-[44px] text-sm font-medium px-3 rounded-xl hover:bg-[#f8f8f9]" onClick={() => setOpen(false)}>
            Features
          </a>
          <a href="#portfolio" className="flex items-center min-h-[44px] text-sm font-medium px-3 rounded-xl hover:bg-[#f8f8f9]" onClick={() => setOpen(false)}>
            Example
          </a>
          <a href="#ai" className="flex items-center min-h-[44px] text-sm font-medium px-3 rounded-xl hover:bg-[#f8f8f9]" onClick={() => setOpen(false)}>
            AI Assistant
          </a>
          <div className="flex gap-2 pt-2">
            <Link href="/login" className="flex-1">
              <Button variant="secondary" className="w-full min-h-[44px]" size="md">
                Log in
              </Button>
            </Link>
            <Link href="/register" className="flex-1">
              <Button className="w-full min-h-[44px]" size="md">
                Showcase ECA
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
