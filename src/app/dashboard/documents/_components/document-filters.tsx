import { Filter } from "lucide-react";
import { DOCUMENT_FILTERS } from "./document-categories";
import type { UnifiedDocument } from "./use-unified-documents";

type DocumentFiltersProps = {
  filter: string;
  onFilterChange: (filter: string) => void;
  items: UnifiedDocument[];
};

/** Category tabs with a live count on each. */
export function DocumentFilters({ filter, onFilterChange, items }: DocumentFiltersProps) {
  const countFor = (name: string) => (name === "All" ? items.length : items.filter((x) => x.category === name).length);

  return (
    <div className="flex items-center gap-2 flex-wrap pb-1">
      <Filter size={14} className="text-muted-foreground mr-1" />
      {DOCUMENT_FILTERS.map((name) => {
        const active = filter === name;
        return (
          <button
            key={name}
            onClick={() => onFilterChange(name)}
            className={`text-xs rounded-full px-3.5 py-1.5 border font-medium cursor-pointer transition flex items-center gap-1.5 ${
              active ? "bg-primary-strong text-white border-primary-strong" : "bg-card border-border text-muted-strong hover:bg-surface-2"
            }`}
          >
            {name}
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${active ? "bg-card/20 text-white" : "bg-surface-2 text-muted"}`}>
              {countFor(name)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
