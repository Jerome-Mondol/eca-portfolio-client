import type { SelectOption } from "@/components/ui/select";
import { Trophy, Award, GraduationCap, BookOpen, Medal, Code2, Star, Tag } from "lucide-react";

export const DEFAULT_CATEGORY = "Competition";

/**
 * The fixed achievement category list.
 *
 * Module-level so the icon elements are built once rather than on every render
 * of the form.
 */
export const ACHIEVEMENT_CATEGORIES: SelectOption[] = [
  { value: "Competition", label: "Competition", icon: <Trophy size={15} /> },
  { value: "Award", label: "Award", icon: <Award size={15} /> },
  { value: "Scholarship", label: "Scholarship", icon: <GraduationCap size={15} /> },
  { value: "Academic", label: "Academic", icon: <BookOpen size={15} /> },
  { value: "Olympiad", label: "Olympiad", icon: <Medal size={15} /> },
  { value: "Hackathon", label: "Hackathon", icon: <Code2 size={15} /> },
  { value: "Recognition", label: "Recognition", icon: <Star size={15} /> },
  { value: "Other", label: "Other", icon: <Tag size={15} /> },
];
