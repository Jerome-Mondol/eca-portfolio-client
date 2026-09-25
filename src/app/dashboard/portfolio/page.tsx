"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";

const defaultSections = ["Hero / Introduction", "About", "Experience", "Projects", "ECA / Activities", "Courses & Certificates", "Achievements", "Skills", "Education", "Contact"];

export default function PortfolioEditorPage() {
  const { user } = useAuth();
  const [sections, setSections] = useState(defaultSections);
  const [theme, setTheme] = useState("Minimal");
  const [accent, setAccent] = useState("#111827");

  const move = (idx: number, dir: number) => {
    const next = [...sections];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setSections(next);
  };

  return (
    <div className="space-y-4 sm:space-y-6 overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight">Portfolio Editor</h1>
          <p className="text-sm text-[#6b6b76] mt-1">Reorder, toggle, preview.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="secondary" className="flex-1 sm:flex-none min-h-[44px]">Preview</Button>
          <a href={user ? `/u/${user.username}` : "/login"} target="_blank" className="flex-1 sm:flex-none">
            <Button className="w-full min-h-[44px]">View Portfolio →</Button>
          </a>
        </div>
      </div>

      <div className="grid lg:grid-cols-[360px_1fr] gap-4 sm:gap-6">
        {/* editor */}
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="text-sm font-semibold">Theme</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Minimal", "Modern", "Academic", "Creative", "Professional"].map((t) => (
                <button key={t} onClick={() => setTheme(t)} className={`min-h-[36px] text-xs rounded-full px-3 py-1.5 border font-medium ${theme === t ? "bg-[#111827] text-white border-[#111827]" : "bg-white border-[#e8e8ea] active:bg-[#f8f8f9]"}`}>
                  {t}
                </button>
              ))}
            </div>
            <h3 className="text-sm font-semibold mt-4">Accent</h3>
            <div className="mt-2 flex gap-2 flex-wrap">
              {["#111827", "#2563eb", "#0f766e", "#be123c", "#7c3aed"].map((c) => (
                <button key={c} onClick={() => setAccent(c)} className={`h-11 w-11 rounded-full border-2 shrink-0 ${accent === c ? "border-[#111827] scale-110" : "border-white shadow"}`} style={{ background: c }} aria-label={c} />
              ))}
            </div>
            <p className="text-xs text-[#8a8a94] mt-2">Tasteful limited palette.</p>
          </Card>

          <Card className="p-4">
            <h3 className="text-sm font-semibold">Sections (drag to reorder)</h3>
            <div className="mt-3 space-y-2">
              {sections.map((s, idx) => (
                <div key={s} className="flex items-center gap-2 rounded-xl border border-[#e8e8ea] bg-white px-3 min-h-[52px] py-2">
                  <span className="text-[#8a8a94] text-lg leading-none select-none">☰</span>
                  <span className="text-sm font-medium flex-1 min-w-0 truncate">{s}</span>
                  <Badge className="shrink-0">Public</Badge>
                  <div className="flex flex-col gap-1 shrink-0">
                    <button onClick={() => move(idx, -1)} className="h-7 w-7 rounded-lg bg-[#f3f3f5] border border-[#e8e8ea] flex items-center justify-center text-xs active:bg-[#ececef]" aria-label="Move up">
                      ↑
                    </button>
                    <button onClick={() => move(idx, 1)} className="h-7 w-7 rounded-lg bg-[#f3f3f5] border border-[#e8e8ea] flex items-center justify-center text-xs active:bg-[#ececef]" aria-label="Move down">
                      ↓
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-[#8a8a94] mt-2">Touch-friendly. Empty sections auto-hide.</p>
          </Card>
        </div>

        {/* preview — stacked on mobile */}
        <Card className="overflow-hidden">
          <div className="h-9 border-b border-[#f0f0f2] flex items-center px-3 sm:px-4 gap-1.5 min-w-0">
            <span className="h-3 w-3 rounded-full bg-[#ff5f56] shrink-0" /><span className="h-3 w-3 rounded-full bg-[#ffbd2e] shrink-0" /><span className="h-3 w-3 rounded-full bg-[#27c93f] shrink-0" />
            <span className="ml-2 text-xs text-[#8a8a94] truncate">folio.com/u/{user?.username || "username"} • {theme}</span>
            <span className="ml-auto h-2 w-2 rounded-full shrink-0" style={{ background: accent }} />
          </div>
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <img src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user?.fullName || user?.username || "User")}`} alt="Avatar" className="h-16 w-16 rounded-2xl border shrink-0 object-cover" width={64} height={64} />
              <div className="min-w-0">
                <h2 className="text-lg font-semibold">{user?.fullName || "Your Name"}</h2>
                <p className="text-sm text-[#6b6b76]">Computer Science Student</p>
                <p className="text-xs mt-1" style={{ color: accent }}>Developer • Builder • Student Leader</p>
                <p className="text-sm text-[#4a4a52] mt-2">Welcome to my portfolio! Showcasing software projects, technical courses, ECA and leadership achievements.</p>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-xs font-semibold tracking-wide uppercase text-[#8a8a94]">Preview order</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {sections.slice(0, 6).map((s) => (
                  <span key={s} className="text-xs border border-[#e8e8ea] rounded-full px-2.5 py-1 bg-[#f8f8f9]">{s}</span>
                ))}
              </div>
            </div>
            <div className="mt-6 grid sm:grid-cols-2 gap-3">
              <div className="rounded-xl border border-[#e8e8ea] p-3">
                <p className="text-xs font-semibold">Projects</p>
                <p className="text-xs text-[#6b6b76] mt-1">AI Study Assistant • Next.js • Featured</p>
              </div>
              <div className="rounded-xl border border-[#e8e8ea] p-3">
                <p className="text-xs font-semibold">Experience</p>
                <p className="text-xs text-[#6b6b76] mt-1">Frontend Intern @ ABC Technologies</p>
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <Button size="sm" style={{ background: accent } as React.CSSProperties}>Contact Me</Button>
              <Button size="sm" variant="secondary">View Projects</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
