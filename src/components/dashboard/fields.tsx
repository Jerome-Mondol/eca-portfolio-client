import type { ReactNode } from "react";
import { Input, Label, Textarea } from "@/components/ui/input";

type TextFieldProps = {
  label: ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: ReactNode;
  type?: string;
  required?: boolean;
  className?: string;
};

/**
 * Label + input pair.
 *
 * The controlled-input plumbing is identical on every form field in the app, so
 * callers pass a value and a setter instead of an onChange handler.
 */
export function TextField({ label, value, onChange, placeholder, hint, type = "text", required, className = "mt-1.5" }: TextFieldProps) {
  return (
    <div>
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={className} type={type} required={required} />
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}

type TextAreaFieldProps = {
  label: ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
};

/** Label + textarea pair. */
export function TextAreaField({ label, value, onChange, placeholder, rows }: TextAreaFieldProps) {
  return (
    <div>
      <Label>{label}</Label>
      <Textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="mt-1.5" rows={rows} />
    </div>
  );
}

type SkillsFieldProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
};

/** Comma-separated skills input, shared by every section that records skills. */
export function SkillsField({ value, onChange, label = "Skills (comma separated)", placeholder = "React, Node.js" }: SkillsFieldProps) {
  return (
    <TextField label={label} value={value} onChange={onChange} placeholder={placeholder} />
  );
}

type FieldGridProps = {
  children: ReactNode;
};

/** Two-up responsive field row used for paired inputs and date pickers. */
export function FieldGrid({ children }: FieldGridProps) {
  return <div className="grid sm:grid-cols-2 gap-3">{children}</div>;
}
