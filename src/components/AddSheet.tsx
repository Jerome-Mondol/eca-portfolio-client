"use client";
import Link from "next/link";
import { X, FolderKanban, Briefcase, Award, GraduationCap, Trophy, Layers, FileText, Lightbulb } from "lucide-react";

const options = [
  { label: "Project", icon: FolderKanban, href: "/dashboard/projects" },
  { label: "Experience", icon: Briefcase, href: "/dashboard/experience" },
  { label: "Certificate", icon: Award, href: "/dashboard/certificates" },
  { label: "Course", icon: GraduationCap, href: "/dashboard/courses" },
  { label: "ECA", icon: Trophy, href: "/dashboard/eca" },
  { label: "Achievement", icon: Layers, href: "/dashboard/achievements" },
  { label: "Award", icon: Award, href: "/dashboard/achievements" },
  { label: "Publication", icon: FileText, href: "/dashboard/achievements" },
  { label: "Skill", icon: Lightbulb, href: "/dashboard/skills" },
];

export function AddSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div
        className="absolute inset-x-0 bottom-0 bg-white rounded-t-[24px] shadow-2xl border-t border-[#e8e8ea] max-h-[82vh] overflow-y-auto"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="sticky top-0 bg-white rounded-t-[24px] px-4 py-4 border-b border-[#f0f0f2] flex items-center justify-between">
          <h3 className="text-[16px] font-semibold tracking-tight">What would you like to add?</h3>
          <button onClick={onClose} className="h-11 w-11 rounded-full bg-[#f3f3f5] border border-[#e8e8ea] flex items-center justify-center active:bg-[#ececef]" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="p-3 grid grid-cols-1 gap-2 pb-6">
          {options.map((o) => (
            <Link
              key={o.label}
              href={o.href}
              onClick={onClose}
              className="flex items-center gap-3 rounded-2xl border border-[#e8e8ea] bg-white hover:bg-[#f8f8f9] active:bg-[#f3f3f5] px-4 min-h-[56px] py-3 transition"
            >
              <span className="h-10 w-10 shrink-0 rounded-xl bg-[#f3f3f5] border border-[#e8e8ea] flex items-center justify-center">
                <o.icon size={18} className="text-[#111827]" />
              </span>
              <span className="text-[15px] font-medium">{o.label}</span>
              <span className="ml-auto text-[#8a8a94] text-lg leading-none">＋</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
