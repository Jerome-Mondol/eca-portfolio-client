"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import type { FileUploadCardProps } from "@/components/ui/file-upload";

/**
 * Lazily loads the uploader.
 *
 * The uploader drags in the upload client and the image slider, neither of
 * which is needed until a form is opened. `ssr: false` forces this wrapper to
 * be a client module.
 */
const FileUploadCard = dynamic(() => import("@/components/ui/file-upload").then((m) => m.FileUploadCard), {
  ssr: false,
  loading: () => <Skeleton className="h-[188px] w-full" />,
});

type SingleUploadFieldProps = Omit<FileUploadCardProps, "values" | "onAddImages" | "onRemoveImage"> & {
  value: string | null;
  fileName?: string | null;
  onChange: (url: string | null, meta?: { originalName?: string; file?: File }) => void;
};

/** Single-file variant — certificates. */
export function SingleUploadField({ value, fileName, onChange, ...rest }: SingleUploadFieldProps) {
  return <FileUploadCard value={value} fileName={fileName} onChange={onChange} {...rest} />;
}

type MultiUploadFieldProps = Omit<FileUploadCardProps, "value" | "fileName" | "onChange"> & {
  values: string[];
  onAddImages: (urls: string[]) => void;
  onRemoveImage: (index: number) => void;
};

/** Multi-image variant — ECA activity photos. */
export function MultiUploadField({ values, onAddImages, onRemoveImage, ...rest }: MultiUploadFieldProps) {
  return (
    <FileUploadCard values={values} onAddImages={onAddImages} onRemoveImage={onRemoveImage} {...rest} />
  );
}
