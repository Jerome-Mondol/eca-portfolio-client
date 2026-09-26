import { Award, ExternalLink, FileText, Link2 } from "lucide-react";
import { getImageUrl } from "@/lib/upload";
import { formatMonthYear } from "@/lib/date";

type Style = { style?: React.CSSProperties };

/**
 * Certificate card. The artwork is framed as a sheet of paper and kept
 * object-contain so a scanned credential is never cropped, and the metadata
 * sits on the dark base underneath rather than on top of the document, which
 * keeps text legible whatever the certificate looks like.
 */
export function CertCard({ certificate: c, style }: Style & { certificate: any }) {
  const isPdf = !!c.documentKey && c.documentKey.toLowerCase().endsWith(".pdf");
  const fileUrl = c.documentKey ? getImageUrl(c.documentKey) : null;
  const date = formatMonthYear(c.issueDate);
  const skills: string[] = Array.isArray(c.skills) ? c.skills.filter(Boolean) : [];

  return (
    <div className="cred-card" style={style}>
      <span className="cred-card__rail" aria-hidden="true" />

      <div className="cred-card__paper">
        {fileUrl && !isPdf ? (
          <img src={fileUrl} alt={c.name} loading="lazy" decoding="async" />
        ) : (
          <div className="flex flex-col items-center gap-1.5 px-3 text-center">
            <FileText size={22} className="text-[#6b6b76]" aria-hidden="true" />
            <p className="text-xs font-medium text-[#111827] break-words line-clamp-2">{c.name}</p>
            {c.documentName && (
              <p className="text-[11px] text-[#6b6b76] break-words line-clamp-1">{c.documentName}</p>
            )}
          </div>
        )}
        {isPdf && (
          <span className="cred-card__filetag">
            <FileText size={10} aria-hidden="true" />
            PDF
          </span>
        )}
      </div>

      <div className="cred-card__body">
        <p className="cred-card__issuer">{c.organization || "Certificate"}</p>
        <h3 className="cred-card__name">{c.name}</h3>
        <p className="cred-card__date">{date || "No date"}</p>

        {c.credentialId && (
          <span className="cred-card__id">
            <Award size={10} aria-hidden="true" />
            {c.credentialId}
          </span>
        )}

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {skills.slice(0, 4).map((skill: string) => (
              <span key={skill} className="course-card__tag">
                {skill}
              </span>
            ))}
            {skills.length > 4 && <span className="course-card__tag">+{skills.length - 4}</span>}
          </div>
        )}

        {(c.credentialUrl || fileUrl) && (
          <div className="cred-card__links">
            {c.credentialUrl && (
              <a className="cred-card__link" href={c.credentialUrl} target="_blank" rel="noopener noreferrer">
                Verify
                <ExternalLink size={10} aria-hidden="true" />
              </a>
            )}
            {fileUrl && (
              <a className="cred-card__link" href={fileUrl} target="_blank" rel="noopener noreferrer">
                {isPdf ? "View PDF" : "View file"}
                <ExternalLink size={10} aria-hidden="true" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Course card. Deliberately light and compact: certificates are the visual
 * anchors of this section, so courses support them rather than compete.
 */
export function CourseCard({
  course: c,
  style,
  linkedCredentialUrl,
}: Style & { course: any; linkedCredentialUrl?: string | null }) {
  const provider = [c.provider, c.instructor].filter(Boolean).join(" • ");
  const skills: string[] = Array.isArray(c.skills) ? c.skills.filter(Boolean) : [];

  return (
    <div className="course-card" style={style}>
      <p className="course-card__provider">{provider || "—"}</p>
      <h3 className="course-card__name">{c.name}</h3>
      {c.description && <p className="course-card__desc">{c.description}</p>}

      {skills.length > 0 && (
        <div className="course-card__tags">
          {skills.slice(0, 5).map((skill: string) => (
            <span key={skill} className="course-card__tag">
              {skill}
            </span>
          ))}
          {skills.length > 5 && <span className="course-card__tag">+{skills.length - 5}</span>}
        </div>
      )}

      {c.certificateId &&
        (linkedCredentialUrl ? (
          <a
            className="course-card__linked"
            href={linkedCredentialUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Link2 size={10} aria-hidden="true" />
            Linked certificate
          </a>
        ) : (
          <span className="course-card__linked">
            <Award size={10} aria-hidden="true" />
            Linked certificate
          </span>
        ))}
    </div>
  );
}
