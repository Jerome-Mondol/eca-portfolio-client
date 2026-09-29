"use client";

import { useState, type DragEvent } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type CertificateDropzoneProps = {
  file: File | null;
  onFile: (file: File) => void;
  onClear: () => void;
  busy: boolean;
  canAnalyze: boolean;
  onAnalyze: () => void;
};

const ACCEPT = "image/jpeg,image/png,image/webp,image/gif,application/pdf";

/** Drop target and file picker for the certificate to analyze. */
export function CertificateDropzone({ file, onFile, onClear, busy, canAnalyze, onAnalyze }: CertificateDropzoneProps) {
  const [dragging, setDragging] = useState(false);

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    setDragging(false);
    const dropped = event.dataTransfer.files?.[0];
    if (dropped) onFile(dropped);
  };

  return (
    <Card className="p-5">
      <h3 className="font-semibold text-sm">Certificate AI Workflow</h3>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`mt-4 rounded-xl border border-dashed p-6 text-center transition ${
          dragging ? "border-primary-strong bg-surface-2" : "border-border-strong bg-card"
        }`}
      >
        {file ? (
          <div className="space-y-3">
            <p className="text-sm font-medium break-all">{file.name}</p>
            <p className="text-xs text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            <Button size="sm" variant="secondary" onClick={onClear} disabled={busy}>
              Choose a different file
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm font-medium">Drop a certificate here</p>
            <p className="text-xs text-muted">PDF, JPG, PNG, WEBP under 10 MB</p>
            <label className="inline-block mt-2">
              <input
                type="file"
                accept={ACCEPT}
                className="sr-only"
                onChange={(event) => {
                  const picked = event.target.files?.[0];
                  if (picked) onFile(picked);
                  event.target.value = "";
                }}
              />
              <span className="inline-block rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium cursor-pointer hover:bg-surface-2">
                Browse files
              </span>
            </label>
          </div>
        )}
      </div>

      {file && (
        <Button className="mt-3" size="sm" onClick={onAnalyze} disabled={busy}>
          {busy ? "Analyzing..." : "Analyze certificate"}
        </Button>
      )}

      <p className="mt-4 text-xs text-muted-foreground">
        Flow: Upload &rarr; File validation &rarr; Vision extraction &rarr; Web research &rarr; Evidence score
      </p>
    </Card>
  );
}

/** Step indicator shown while the analysis request is in flight. */
export function CertificateProgress({ phase }: { phase: number }) {
  return (
    <div className="mt-4 rounded-xl border border-border bg-surface-2 p-4">
      <p className="text-sm font-medium flex items-center gap-2">
        <Loader2 size={13} className="animate-spin" /> Working on it — this takes 10-25 seconds.
      </p>
      <ol className="mt-2 space-y-1 text-xs text-muted">
        <li className={phase >= 0 ? "text-foreground" : ""}>1. Reading the document</li>
        <li className={phase >= 1 ? "text-foreground" : ""}>2. Checking the issuer on the web</li>
        <li className={phase >= 2 ? "text-foreground" : ""}>3. Scoring the evidence</li>
      </ol>
    </div>
  );
}
