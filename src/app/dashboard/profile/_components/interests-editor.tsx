import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

type InterestsEditorProps = {
  interests: string[];
  onRemove: (interest: string) => void;
  newInterest: string;
  onNewInterestChange: (value: string) => void;
  onAdd: () => void;
};

/** Click a tag to remove it; the field adds new ones. */
export function InterestsEditor(props: InterestsEditorProps) {
  return (
    <div className="pt-2 border-t border-border-soft">
      <p className="text-xs font-medium mb-2">Interests & Topics</p>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {props.interests.map((interest) => (
          <Badge
            key={interest}
            className="cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition"
            onClick={() => props.onRemove(interest)}
          >
            {interest} ✕
          </Badge>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          props.onAdd();
        }}
        className="flex items-center gap-2"
      >
        <Input
          value={props.newInterest}
          onChange={(e) => props.onNewInterestChange(e.target.value)}
          placeholder="e.g. Machine Learning, UI Design, Robotics"
          className="h-9 text-xs"
        />
        <Button type="submit" variant="secondary" size="sm" className="h-9 cursor-pointer shrink-0">
          <Plus size={14} className="mr-1" /> Add
        </Button>
      </form>
    </div>
  );
}
