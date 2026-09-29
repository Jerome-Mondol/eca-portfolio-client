"use client";

import { PageHeader, AddButton } from "@/components/dashboard/page-header";
import { ListSkeleton, ListOrEmpty } from "@/components/dashboard/list-parts";
import { FormShell } from "@/components/dashboard/form-shell";
import { useResource } from "@/lib/store";
import { listCertificatesApi, type Certificate } from "@/lib/api";
import { CertificateForm } from "./certificate-form";
import { CertificateCard } from "./certificate-card";
import { useCertificateForm } from "./use-certificate-form";

const EMPTY: Certificate[] = [];

export function CertificatesView() {
  // Synchronous read from the warmed store — no skeleton on repeat visits.
  const { data, loading } = useResource<{ data: Certificate[] }>("certificates", listCertificatesApi);
  const items = data?.data ?? EMPTY;
  const { form, documentKey, documentName, handleSubmit, handleEdit, handleDelete, onDocumentChange } =
    useCertificateForm();

  if (loading) return <ListSkeleton count={2} height="h-40" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Certificates"
        description="Showcase with image or PDF for portfolio."
        action={<AddButton open={form.open} label="Add Certificate" onClick={form.toggle} />}
      />

      <FormShell
        open={form.open}
        saving={form.saving}
        onSubmit={handleSubmit}
        submitLabel={form.isEditing ? "Update certificate" : "Create certificate"}
        savingLabel={form.isEditing ? "Updating..." : "Creating..."}
      >
        <CertificateForm
          values={form.values}
          set={form.set}
          documentKey={documentKey}
          documentName={documentName}
          onDocumentChange={onDocumentChange}
        />
      </FormShell>

      <ListOrEmpty
        items={items}
        gridClassName="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        empty={{
          title: "No certificates yet",
          description: "Upload an image or PDF to showcase in your portfolio.",
          actionLabel: "Add certificate",
          onAction: form.startCreate,
        }}
      >
        {(certificate) => (
          <CertificateCard
            key={certificate.id}
            certificate={certificate}
            onEdit={() => handleEdit(certificate)}
            onDelete={() => handleDelete(certificate)}
          />
        )}
      </ListOrEmpty>
    </div>
  );
}
