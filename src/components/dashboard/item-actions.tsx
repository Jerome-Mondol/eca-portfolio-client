type ItemActionsProps = {
  onEdit: () => void;
  onDelete: () => void;
};

/** Edit / Delete pair shown at the bottom of every dashboard list card. */
export function ItemActions({ onEdit, onDelete }: ItemActionsProps) {
  return (
    <div className="mt-3 flex gap-2">
      <button
        onClick={onEdit}
        className="text-xs font-medium border border-border rounded-full px-3 py-1.5 hover:bg-surface-2 cursor-pointer flex-1"
      >
        Edit
      </button>
      <button
        onClick={onDelete}
        className="text-xs font-medium border border-red-200 text-red-600 rounded-full px-3 py-1.5 hover:bg-red-50 cursor-pointer flex-1"
      >
        Delete
      </button>
    </div>
  );
}
