import { Label } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SingleUploadField } from "@/components/dashboard/file-upload-field";
import { DOCUMENT_CATEGORIES } from "./document-categories";

type DocumentFormProps = {
  uploadedUrl: string | null;
  fileName: string;
  docName: string;
  onDocNameChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  onUpload: (url: string | null, meta?: { originalName?: string }) => void;
};

/**
 * Upload plus the name and category.
 *
 * Name and category stay hidden until a file is chosen, since there is nothing
 * to label otherwise.
 */
export function DocumentForm(props: DocumentFormProps) {
  return (
    <>
      <SingleUploadField
        value={props.uploadedUrl}
        fileName={props.fileName || props.docName}
        onChange={props.onUpload}
        title="Upload Document or Proof File"
        subtitle="Upload PDF or image file to store in your document library."
      />

      {props.uploadedUrl && (
        <div className="grid sm:grid-cols-2 gap-3 pt-2">
          <div>
            <Label className="text-xs font-medium">Document Name / Label</Label>
            <input
              type="text"
              value={props.docName}
              onChange={(e) => props.onDocNameChange(e.target.value)}
              placeholder="e.g. AWS Certification PDF, Resume"
              className="mt-1 w-full rounded-xl border border-border px-3.5 py-2.5 text-sm outline-none focus:border-primary-strong"
            />
          </div>
          <div>
            <Label className="text-xs font-medium">Category</Label>
            <div className="mt-1">
              <Select value={props.category} onChange={props.onCategoryChange} options={DOCUMENT_CATEGORIES} placeholder="Select Category" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
