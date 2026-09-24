import { Button } from "./button";

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#e0e0e4] bg-[#fcfcfd] px-6 py-12 text-center">
      <div className="h-10 w-10 rounded-xl bg-white border border-[#e8e8ea] shadow-sm mb-4 flex items-center justify-center text-[#8a8a94]">＋</div>
      <h3 className="text-[15px] font-semibold tracking-tight">{title}</h3>
      <p className="mt-1.5 max-w-sm text-[13.5px] leading-5 text-[#6b6b76]">{description}</p>
      {actionLabel && (
        <Button className="mt-5" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
