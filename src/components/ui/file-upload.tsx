"use client";

import { useRef, useState } from "react";
import { Upload, FileText, X, Loader2, Image as ImageIcon } from "lucide-react";
import { uploadImage, getImageUrl } from "@/lib/upload";
import { Button } from "./button";
import { useToast } from "./toast";
import { ImageSlider } from "./image-slider";

type SingleProps = {
  value: string | null;
  onChange: (url: string | null) => void;
  values?: never;
  onAddImages?: never;
  onRemoveImage?: never;
  maxFiles?: number;
};

type MultiProps = {
  value?: never;
  onChange?: never;
  values: string[];
  onAddImages: (urls: string[]) => void;
  onRemoveImage: (index: number) => void;
  maxFiles?: number;
};

type CommonProps = {
  accept?: string;
  maxSizeMB?: number;
  title?: string;
  subtitle?: string;
};

export type FileUploadCardProps = CommonProps & (SingleProps | MultiProps);

export function FileUploadCard({
  value,
  onChange,
  values,
  onAddImages,
  onRemoveImage,
  maxFiles = 5,
  accept = "image/*,application/pdf",
  maxSizeMB = 10,
  title = "Upload certificate image or PDF",
  subtitle = "Will be shown in your public portfolio.",
}: FileUploadCardProps) {
  const { error: toastError, success } = useToast();
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const isMulti = Array.isArray(values);
  const isPdf = (url: string | null) =>
    !!url &&
    (url.toLowerCase().endsWith(".pdf") ||
      url.toLowerCase().includes("application/pdf") ||
      url.toLowerCase().includes(".pdf"));

  const handleFiles = async (filesList: FileList | File[]) => {
    const files = Array.from(filesList);
    if (!files || files.length === 0) return;

    if (isMulti) {
      const remaining = maxFiles - values.length;
      if (remaining <= 0) {
        toastError(`Max ${maxFiles} images allowed`);
        return;
      }
      const toUpload = files.slice(0, remaining);
      if (files.length > remaining) {
        toastError(`Only ${remaining} more allowed`, `Max ${maxFiles} images per item`);
      }

      setUploading(true);
      try {
        const uploadedUrls: string[] = [];
        for (const file of toUpload) {
          if (file.size > maxSizeMB * 1024 * 1024) {
            toastError(`File ${file.name} too large`, `Max ${maxSizeMB}MB`);
            continue;
          }
          const res = await uploadImage(file);
          uploadedUrls.push(res.url);
        }
        if (uploadedUrls.length > 0) {
          onAddImages?.(uploadedUrls);
          success(`${uploadedUrls.length} file${uploadedUrls.length > 1 ? "s" : ""} uploaded`);
        }
      } catch (err: any) {
        toastError("Upload failed", err.message);
      } finally {
        setUploading(false);
        if (fileRef.current) fileRef.current.value = "";
      }
    } else {
      const file = files[0];
      if (file.size > maxSizeMB * 1024 * 1024) {
        toastError(`File too large`, `Max ${maxSizeMB}MB`);
        return;
      }
      setUploading(true);
      try {
        const res = await uploadImage(file);
        onChange?.(res.url);
        success("File uploaded", file.name);
      } catch (err: any) {
        toastError("Upload failed", err.message);
      } finally {
        setUploading(false);
        if (fileRef.current) fileRef.current.value = "";
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };

  const handleContainerClick = () => {
    if (!uploading) fileRef.current?.click();
  };

  return (
    <div
      onClick={handleContainerClick}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={`group relative rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden ${
        dragOver
          ? "border-[#111827] bg-[#f3f3f5] shadow-md"
          : "border-[#d0d0d6] bg-[#fcfcfd] hover:bg-white hover:border-[#111827]/20 hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)]"
      }`}
    >
      <input
        ref={fileRef}
        type="file"
        accept={accept}
        multiple={isMulti}
        className="hidden"
        onChange={handleInputChange}
      />

      {isMulti ? (
        values.length > 0 ? (
          <div className="p-4 space-y-3" onClick={(e) => e.stopPropagation()}>
            <ImageSlider images={values} editable onRemove={onRemoveImage} />

            {values.length < maxFiles && (
              <div className="flex items-center justify-between pt-1 border-t border-[#e8e8ea]">
                <span className="text-xs text-[#6b6b76]">
                  {values.length}/{maxFiles} images added
                </span>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={uploading}
                  className="cursor-pointer"
                  onClick={() => fileRef.current?.click()}
                >
                  {uploading ? (
                    <>
                      <Loader2 size={14} className="mr-1 animate-spin" /> Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={14} className="mr-1" /> Add more images
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 sm:p-8 text-center">
            <div className="h-12 w-12 rounded-2xl bg-white border border-[#e8e8ea] shadow-sm flex items-center justify-center mx-auto">
              <ImageIcon size={18} className="text-[#6b6b76]" />
            </div>
            <h3 className="text-sm font-semibold mt-3">{title}</h3>
            <p className="text-xs text-[#6b6b76] mt-1">{subtitle}</p>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={uploading}
              className="mt-4 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                fileRef.current?.click();
              }}
            >
              {uploading ? (
                <>
                  <Loader2 size={14} className="mr-1 animate-spin" /> Uploading...
                </>
              ) : (
                <>
                  <Upload size={14} className="mr-1" /> Choose images
                </>
              )}
            </Button>
            <p className="text-[11px] text-[#8a8a94] mt-2">
              Images or PDF • Max {maxSizeMB}MB • Up to {maxFiles} images
            </p>
          </div>
        )
      ) : value ? (
        <div className="p-3" onClick={(e) => e.stopPropagation()}>
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
                onClick={() => onChange?.(null)}
                className="h-7 w-7 rounded-full bg-white border border-[#e8e8ea] flex items-center justify-center hover:bg-red-50 hover:text-red-600 hover:border-red-200 cursor-pointer shrink-0"
                aria-label="Remove file"
              >
                <X size={12} />
              </button>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={uploading}
              className="cursor-pointer"
              onClick={() => fileRef.current?.click()}
            >
              {uploading ? (
                <>
                  <Loader2 size={14} className="mr-1 animate-spin" /> Uploading...
                </>
              ) : (
                <>
                  <Upload size={14} className="mr-1" /> Change file
                </>
              )}
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
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={uploading}
            className="mt-4 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              fileRef.current?.click();
            }}
          >
            {uploading ? (
              <>
                <Loader2 size={14} className="mr-1 animate-spin" /> Uploading...
              </>
            ) : (
              <>
                <Upload size={14} className="mr-1" /> Upload file
              </>
            )}
          </Button>
          <p className="text-[11px] text-[#8a8a94] mt-2">Images or PDF • Max {maxSizeMB}MB • R2 storage</p>
        </div>
      )}
    </div>
  );
}
