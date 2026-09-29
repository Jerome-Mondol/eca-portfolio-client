/** The two AI workflows, as a segmented switch. */
export function AiModeSwitcher({ mode, onChange }: { mode: "certificate" | "project"; onChange: (mode: "certificate" | "project") => void }) {
  const options = [
    { value: "certificate" as const, label: "Certificate" },
    { value: "project" as const, label: "Project" },
  ];

  return (
    <div className="inline-flex gap-1 rounded-lg bg-surface-2 p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition cursor-pointer ${
            mode === option.value ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
