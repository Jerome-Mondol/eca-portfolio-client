"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { DEFAULT_SECTIONS, moveSection } from "./portfolio-options";
import { PortfolioAppearance, PortfolioSectionOrder } from "./portfolio-editor-panels";
import { PortfolioPreview } from "./portfolio-preview";

export function PortfolioEditorView() {
  const { user } = useAuth();
  const [sections, setSections] = useState(DEFAULT_SECTIONS);
  const [theme, setTheme] = useState("Minimal");
  const [accent, setAccent] = useState("#c2410c");

  return (
    <div className="space-y-4 sm:space-y-6 overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight">Portfolio Editor</h1>
          <p className="text-sm text-muted mt-1">Reorder, toggle, preview.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="secondary" className="flex-1 sm:flex-none min-h-[44px]">Preview</Button>
          <a href={user ? `/u/${user.username}` : "/login"} target="_blank" className="flex-1 sm:flex-none">
            <Button className="w-full min-h-[44px]">View Portfolio →</Button>
          </a>
        </div>
      </div>

      <div className="grid lg:grid-cols-[360px_1fr] gap-4 sm:gap-6">
        <div className="space-y-4">
          <PortfolioAppearance theme={theme} onThemeChange={setTheme} accent={accent} onAccentChange={setAccent} />
          <PortfolioSectionOrder sections={sections} onMove={(index, direction) => setSections((prev) => moveSection(prev, index, direction))} />
        </div>

        <PortfolioPreview
          username={user?.username ?? ""}
          fullName={user?.fullName ?? ""}
          theme={theme}
          accent={accent}
          sections={sections}
        />
      </div>
    </div>
  );
}
