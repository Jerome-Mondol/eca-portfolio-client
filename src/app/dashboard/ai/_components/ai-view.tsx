"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { useResource } from "@/lib/store";
import { listProjectsApi, type Project } from "@/lib/api";
import { AiModeSwitcher } from "./ai-mode-switcher";
import { CertificateDropzone, CertificateProgress } from "./certificate-dropzone";
import { CertificateResultCard } from "./certificate-result";
import { CertificateExtractedFields } from "./certificate-extracted-fields";
import { useCertificateAnalysis } from "./use-certificate-analysis";
import { ProjectNotesCard } from "./project-notes-card";
import { ProjectSuggestionCard } from "./project-suggestion-card";
import { useProjectImprover } from "./use-project-improver";

const EMPTY: Project[] = [];

type Mode = "certificate" | "project";

export function AiView() {
  const [mode, setMode] = useState<Mode>("certificate");
  const certificate = useCertificateAnalysis();
  const projects = useResource<{ data: Project[] }>("projects", listProjectsApi);
  const improver = useProjectImprover(projects.data?.data ?? EMPTY);

  return (
    <div>
      <PageHeader
        title="AI Workspace"
        description="Two grounded workflows. Nothing is published without you."
        action={<AiModeSwitcher mode={mode} onChange={setMode} />}
      />

      {mode === "certificate" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <CertificateDropzone
              file={certificate.file}
              onFile={certificate.setFile}
              onClear={certificate.discard}
              busy={certificate.busy}
              canAnalyze={!!certificate.file}
              onAnalyze={certificate.runAnalysis}
            />
            {certificate.busy && <CertificateProgress phase={certificate.phase} />}
          </div>
          <CertificateResultCard
            result={certificate.result}
            form={certificate.form}
            onFormChange={certificate.setForm}
            saving={certificate.saving}
            savePhase={certificate.savePhase}
            onSave={certificate.acceptAndSave}
            onReanalyze={certificate.runAnalysis}
            onDiscard={certificate.discard}
            saveMessage={certificate.saveMessage}
            error={certificate.error}
            busy={certificate.busy}
            fields={
              <CertificateExtractedFields
                form={certificate.form}
                onChange={certificate.setForm}
                rawTextExcerpt={certificate.result?.extracted.rawTextExcerpt ?? undefined}
              />
            }
          />
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <ProjectNotesCard
            projects={projects.data?.data ?? EMPTY}
            sourceId={improver.sourceId}
            onLoadProject={improver.loadProject}
            title={improver.title}
            onTitleChange={improver.setTitle}
            input={improver.input}
            onInputChange={improver.setInput}
            improving={improver.improving}
            canImprove={improver.canImprove}
            hasSuggestion={improver.hasSuggestion}
            onImprove={() => improver.runImprove()}
            onReset={improver.reset}
            error={improver.error}
          />
          <ProjectSuggestionCard
            suggestion={improver.suggestion}
            improving={improver.improving}
            saving={improver.saving}
            sourceId={improver.sourceId}
            currentTitle={improver.title}
            baseline={improver.baseline}
            draft={improver.draft}
            onDraftChange={improver.setDraft}
            showDiff={improver.showDiff}
            onToggleDiff={() => improver.setShowDiff((value) => !value)}
            ungroundedTech={improver.ungroundedTech}
            diffStats={improver.diffStats}
            answers={improver.answers}
            onAnswerChange={(question, value) => improver.setAnswers({ ...improver.answers, [question]: value })}
            onRewriteWithAnswers={() => improver.runImprove(true)}
            onSave={improver.save}
            onCopy={improver.copy}
            onReset={improver.reset}
          />
        </div>
      )}
    </div>
  );
}
