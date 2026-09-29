"use client";

import { useState, type FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { createSkillApi } from "@/lib/api";

export const SKILL_CATEGORIES = ["Technical", "Creative", "Leadership", "Communication", "Languages", "Other"] as const;

type SkillFormProps = {
  name: string;
  onNameChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
};

/**
 * A single inline row rather than a collapsible form.
 *
 * There is only one field, so an expand/collapse would add a step without
 * hiding anything.
 */
export function SkillForm({ name, onNameChange, category, onCategoryChange }: SkillFormProps) {
  const { success, error: toastError } = useToast();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      toastError("Name required");
      return;
    }
    setSaving(true);
    try {
      // createSkillApi writes the new list straight into the store.
      await createSkillApi({ name: name.trim(), category });
      onNameChange("");
      success("Skill added");
    } catch (err) {
      toastError("Add failed", err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-5">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-end">
        <div className="flex-1 w-full">
          <Label>Name *</Label>
          <Input value={name} onChange={(e) => onNameChange(e.target.value)} placeholder="React, Leadership..." className="mt-1.5" />
        </div>
        <div className="w-full sm:w-44">
          <Label>Category</Label>
          <div className="mt-1.5">
            <Select value={category} onChange={onCategoryChange} options={[...SKILL_CATEGORIES]} />
          </div>
        </div>
        <Button type="submit" disabled={saving} className="w-full sm:w-auto min-h-[44px] cursor-pointer">
          {saving ? (<><Loader2 size={14} className="mr-1.5 animate-spin" /> Adding...</>) : "Add skill"}
        </Button>
      </form>
    </Card>
  );
}
