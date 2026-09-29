import type { SelectOption } from "@/components/ui/select";
import { Briefcase, GraduationCap, BookOpen, Sparkles, Palette, Users, HeartHandshake } from "lucide-react";

export const DEFAULT_CATEGORY = "Job / Work Experience";

/**
 * The fixed category list.
 *
 * Module-level because it is static data: keeping it out of the component stops
 * a new array (and its icon elements) being built on every render.
 */
export const EXPERIENCE_CATEGORIES: SelectOption[] = [
  { value: DEFAULT_CATEGORY, label: "Job / Work Experience", icon: <Briefcase size={16} /> },
  { value: "Internship", label: "Internship", icon: <GraduationCap size={16} /> },
  { value: "Bootcamp / Training", label: "Bootcamp / Training", icon: <BookOpen size={16} /> },
  { value: "Workshop / Seminar", label: "Workshop / Seminar", icon: <Sparkles size={16} /> },
  { value: "Creative & Arts / Project", label: "Creative & Arts / Project", icon: <Palette size={16} /> },
  { value: "Club / Student Org Leadership", label: "Club / Student Org Leadership", icon: <Users size={16} /> },
  { value: "Volunteering & Community", label: "Volunteering & Community", icon: <HeartHandshake size={16} /> },
];
