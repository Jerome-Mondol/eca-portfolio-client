import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PORTFOLIO_ACCENTS, PORTFOLIO_THEMES } from "./portfolio-options";

type PortfolioAppearanceProps = {
  theme: string;
  onThemeChange: (theme: string) => void;
  accent: string;
  onAccentChange: (accent: string) => void;
};

/** Theme picker and accent swatches. */
export function PortfolioAppearance({ theme, onThemeChange, accent, onAccentChange }: PortfolioAppearanceProps) {
  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold">Theme</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {PORTFOLIO_THEMES.map((option) => (
          <button
            key={option}
            onClick={() => onThemeChange(option)}
            className={`min-h-[36px] text-xs rounded-full px-3 py-1.5 border font-medium ${
              theme === option ? "bg-primary-strong text-white border-primary-strong" : "bg-card border-border active:bg-surface-2"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      <h3 className="text-sm font-semibold mt-4">Accent</h3>
      <div className="mt-2 flex gap-2 flex-wrap">
        {PORTFOLIO_ACCENTS.map((color) => (
          <button
            key={color}
            onClick={() => onAccentChange(color)}
            className={`h-11 w-11 rounded-full border-2 shrink-0 ${
              accent === color ? "border-primary-strong scale-110" : "border-white shadow"
            }`}
            style={{ background: color }}
            aria-label={color}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-2">Tasteful limited palette.</p>
    </Card>
  );
}

/** The reorderable section list. */
export function PortfolioSectionOrder({ sections, onMove }: { sections: string[]; onMove: (index: number, direction: number) => void }) {
  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold">Sections (drag to reorder)</h3>
      <div className="mt-3 space-y-2">
        {sections.map((section, index) => (
          <div key={section} className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 min-h-[52px] py-2">
            <span className="text-muted-foreground text-lg leading-none select-none">☰</span>
            <span className="text-sm font-medium flex-1 min-w-0 truncate">{section}</span>
            <Badge className="shrink-0">Public</Badge>
            <div className="flex flex-col gap-1 shrink-0">
              <button onClick={() => onMove(index, -1)} className="h-7 w-7 rounded-lg bg-surface-2 border border-border flex items-center justify-center text-xs active:bg-border-strong" aria-label={`Move ${section} up`}>
                ↑
              </button>
              <button onClick={() => onMove(index, 1)} className="h-7 w-7 rounded-lg bg-surface-2 border border-border flex items-center justify-center text-xs active:bg-border-strong" aria-label={`Move ${section} down`}>
                ↓
              </button>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-2">Touch-friendly. Empty sections auto-hide.</p>
    </Card>
  );
}
