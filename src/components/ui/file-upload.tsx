"use client";

import { useRef, useState } from "react";
import { Upload, FileText, X, Loader2, Image as ImageIcon } from "lucide-react";
import { uploadImage, getImageUrl } from "@/lib/upload";
import { Button } from "./button";
import { useToast } from "./toast";
import { ImageSlider } from "./image-slider";

type SingleProps = {
  value: string | null;
  onChange: (url: string | null, meta?: { originalName?: string; file?: File }) => void;
  fileName?: string | null;
  values?: never;
  onAddImages?: never;
  onRemoveImage?: never;
  maxFiles?: number;
};

type MultiProps = {
  value?: never;
  onChange?: never;
  fileName?: never;
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
  fileName,
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
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const isMulti = Array.isArray(values);
  const isPdf = (url: string | null) =>
    !!url &&
    (url.toLowerCase().endsWith(".pdf") ||
      url.toLowerCase().includes("application/pdf") ||
      url.toLowerCase().includes(".pdf"));

  const rawName = value ? value.split("/").pop() || "" : "";
  const displayFileName =
    fileName ||
    uploadedFileName ||
    (rawName ? (rawName.includes("-") && /^\d+-/.test(rawName) ? rawName.replace(/^\d+-[a-z0-9]+\./i, "file.") : rawName) : "Uploaded file");

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
        const nameToUse = res.originalName || file.name;
        setUploadedFileName(nameToUse);
        onChange?.(res.url, { originalName: nameToUse, file });
        success("File uploaded", nameToUse);
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
      className={`group relative rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden ${dragOver
          ? "border-primary-strong bg-surface-2 shadow-md"
          : "border-border-strong bg-card hover:bg-card hover:border-primary-strong/20 hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)]"
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
              <div className="flex items-center justify-between pt-1 border-t border-border">
                <span className="text-xs text-muted">
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
            <div className="h-12 w-12 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-center mx-auto">
              <ImageIcon size={18} className="text-muted" />
            </div>
            <h3 className="text-sm font-semibold mt-3">{title}</h3>
            <p className="text-xs text-muted mt-1">{subtitle}</p>
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
            <p className="text-[11px] text-muted-foreground mt-2">
              Images or PDF • Max {maxSizeMB}MB • Up to {maxFiles} images
            </p>
          </div>
        )
      ) : value ? (
        <div className="p-3" onClick={(e) => e.stopPropagation()}>
          <div className="rounded-xl border border-border overflow-hidden bg-card">
            {isPdf(value) ? (
              <div className="h-36 flex flex-col items-center justify-center gap-2 p-4 bg-surface-2">
                <div className="h-10 w-10 rounded-xl bg-card border border-border flex items-center justify-center">
                  <FileText size={18} className="text-muted" />
                </div>
                <p className="text-xs font-medium truncate max-w-[200px]">{displayFileName}</p>
                <p className="text-xs text-muted-foreground">PDF • Click to change</p>
              </div>
            ) : (
              <img src={getImageUrl(value)} alt="Preview" className="h-48 w-full object-contain bg-card" />
            )}
            <div className="p-2 flex items-center justify-between bg-surface-2 border-t border-border">
              <span className="text-xs text-muted truncate flex-1 px-1">{displayFileName}</span>
              <button
                type="button"
                onClick={() => {
                  setUploadedFileName(null);
                  onChange?.(null);
                }}
                className="h-7 w-7 rounded-full bg-card border border-border flex items-center justify-center hover:bg-red-50 hover:text-red-600 hover:border-red-200 cursor-pointer shrink-0"
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
          <div className="h-12 w-12 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-center mx-auto">
            <ImageIcon size={18} className="text-muted" />
          </div>
          <h3 className="text-sm font-semibold mt-3">{title}</h3>
          <p className="text-xs text-muted mt-1">{subtitle}</p>
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
          <p className="text-[11px] text-muted-foreground mt-2">Images or PDF • Max {maxSizeMB}MB • R2 storage</p>
        </div>
      )}
    </div>
  );
}
