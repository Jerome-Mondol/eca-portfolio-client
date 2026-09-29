"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/dashboard/page-header";
import { useToast } from "@/components/ui/toast";
import { listSkillsApi, deleteSkillApi, type Skill } from "@/lib/api";
import { useResource } from "@/lib/store";
import { SkillForm } from "./skill-form";
import { SkillGroups } from "./skill-groups";

const EMPTY: Skill[] = [];

export function SkillsView() {
  const { success, error: toastError } = useToast();
  // Synchronous read from the warmed store — no spinner on repeat visits.
  const { data, loading } = useResource<{ data: Skill[] }>("skills", listSkillsApi);
  const items = data?.data ?? EMPTY;
  const [name, setName] = useState("");
  const [category, setCategory] = useState<string>("Technical");

  const handleDelete = async (id: string) => {
    try {
      await deleteSkillApi(id);
      success("Deleted");
    } catch (err) {
      toastError("Delete failed", err instanceof Error ? err.message : String(err));
    }
  };

  if (loading) return <Skeleton className="h-64" />;

  return (
    <div className="space-y-6">
      <PageHeader title="Skills" description="Evidence, not percentages." />

      <SkillForm name={name} onNameChange={setName} category={category} onCategoryChange={setCategory} />
      <SkillGroups skills={items} onDelete={handleDelete} />
    </div>
  );
}
