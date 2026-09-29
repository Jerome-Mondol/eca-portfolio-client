import type { SelectOption } from "@/components/ui/select";
import { Award, Trophy, FolderKanban, FileCode } from "lucide-react";

/** Category choices when storing a document. */
export const DOCUMENT_CATEGORIES: SelectOption[] = [
  { value: "Certificates", label: "Certificates", icon: <Award size={15} /> },
  { value: "Awards", label: "Awards & Achievements", icon: <Trophy size={15} /> },
  { value: "Projects", label: "Projects", icon: <FolderKanban size={15} /> },
  { value: "Other", label: "Other Documents", icon: <FileCode size={15} /> },
];

/** Filter tabs, in the order they appear above the grid. */
export const DOCUMENT_FILTERS = ["All", "Certificates", "Awards", "Projects", "Other"];
