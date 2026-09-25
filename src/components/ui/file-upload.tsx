"use client";
import { useRef, useState } from "react";
import { Upload, FileText, X, Loader2, Image as ImageIcon } from "lucide-react";
import { uploadImage, getImageUrl } from "@/lib/upload";
import { Button } from "./button";
import { useToast } from "./toast";

type Props = {
  value: string | null; // URL or R2 key
  onChange: (url: string | null) => void;
  accept?: string; // default image/*,application/pdf
  maxSizeMB?: number;
  title?: string;
  subtitle?: string;
};

export function FileUploadCard({ value, onChange, accept = "image/*,application/pdf", maxSizeMB = 10, title = "Upload certificate image or PDF", subtitle = "Will be shown in your public portfolio." }: Props) {
  const { error: toastError, success } = useToast();
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const isPdf = (url: string | null) => !!url && (url.toLowerCase().endsWith(".pdf") || url.toLowerCase().includes("application/pdf") || url.toLowerCase().includes(".pdf"));

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > maxSizeMB * 1024 * 1024) {
      toastError(`File too large`, `Max ${maxSizeMB}MB`);
      return;
    }
    setUploading(true);
    try {
      const res = await uploadImage(file);
      onChange(res.url);
      success("File uploaded", file.name);
    } catch (err: any) {
      toastError("Upload failed", err.message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleContainerClick = () => {
    if (!uploading) fileRef.current?.click();
  };

  return (
    <div
      onClick={handleContainerClick}
      className="group relative rounded-2xl border-2 border-dashed border-[#d0d0d6] bg-[#fcfcfd] hover:bg-white hover:border-[#111827]/20 hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-all cursor-pointer overflow-hidden"
    >
      <input ref={fileRef} type="file" accept={accept} className="hidden" onChange={handleFile} />

      {value ? (
        <div className="p-3">
          <div className="rounded-xl border border-[#e8e8ea] overflow-hidden bg-white">
            {isPdf(value) ? (
              <div className="h-36 flex flex-col items-center justify-center gap-2 p-4 bg-[#f8f8f9]">
                <div className="h-10 w-10 rounded-xl bg-white border border-[#e8e8ea] flex items-center justify-center">
                  <FileText size={18} className="text-[#6b6b76]" />
                </div>
                <p className="text-xs font-medium truncate max-w-[200px]">{value.split("/").pop()}</p>
                <p className="text-xs text-[#8a8a94]">PDF • Click to change</p>
              </div>
            ) : (
              <img src={getImageUrl(value)} alt="Preview" className="h-48 w-full object-contain bg-white" />
            )}
            <div className="p-2 flex items-center justify-between bg-[#f8f8f9] border-t border-[#e8e8ea]">
              <span className="text-xs text-[#6b6b76] truncate flex-1 px-1">{value.split("/").pop()}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(null);
                }}
                className="h-7 w-7 rounded-full bg-white border border-[#e8e8ea] flex items-center justify-center hover:bg-red-50 hover:text-red-600 hover:border-red-200 cursor-pointer shrink-0"
                aria-label="Remove file"
              >
                <X size={12} />
              </button>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-center gap-2">
            <Button type="button" variant="secondary" size="sm" disabled={uploading} className="cursor-pointer" onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}>
              {uploading ? <><Loader2 size={14} className="mr-1 animate-spin" /> Uploading...</> : <><Upload size={14} className="mr-1" /> Change file</>}
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-6 sm:p-8 text-center">
          <div className="h-12 w-12 rounded-2xl bg-white border border-[#e8e8ea] shadow-sm flex items-center justify-center mx-auto">
            <ImageIcon size={18} className="text-[#6b6b76]" />
          </div>
          <h3 className="text-sm font-semibold mt-3">{title}</h3>
          <p className="text-xs text-[#6b6b76] mt-1">{subtitle}</p>
          <Button type="button" variant="secondary" size="sm" disabled={uploading} className="mt-4 cursor-pointer" onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}>
            {uploading ? <><Loader2 size={14} className="mr-1 animate-spin" /> Uploading...</> : <><Upload size={14} className="mr-1" /> Upload file</>}
          </Button>
          <p className="text-[11px] text-[#8a8a94] mt-2">Images or PDF • Max {maxSizeMB}MB • R2 storage</p>
        </div>
      )}
    </div>
  );
}
