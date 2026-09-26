import { Layers, Sparkles } from "lucide-react";
import { getImageUrl } from "@/lib/upload";

type ActivityCardProps = {
  activity: any;
  style?: React.CSSProperties;
};

/**
 * Media-forward activity card: full-bleed cover photo, gradient scrim, and the
 * text anchored to the bottom. An accent rail wipes in on hover, matching the
 * chroma edge on the experience timeline so the two sections feel related.
 */
export function EcaCard({ activity: a, style }: ActivityCardProps) {
  const images: string[] = Array.isArray(a.images) ? a.images.filter(Boolean) : [];
  const cover = images[0];
  const extra = images.length - 1;
  const skills: string[] = Array.isArray(a.skills) ? a.skills.filter(Boolean) : [];
  const meta = [a.role, a.organization].filter(Boolean).join(" • ");

  const body = (
    <>
      {cover ? (
        <div className="eca-card__media">
          <img
            src={getImageUrl(cover)}
            alt=""
            loading="lazy"
            decoding="async"
            width={600}
            height={400}
          />
        </div>
      ) : (
        <div className="eca-card__fallback">
          <Sparkles size={30} aria-hidden="true" />
        </div>
      )}
      <div className="eca-card__shade" />
      <span className="eca-card__rail" aria-hidden="true" />
      {extra > 0 && (
        <span className="eca-card__count">
          <Layers size={11} aria-hidden="true" />+{extra}
        </span>
      )}

      <div className="eca-card__content">
        <span className="eca-card__pill">{a.category || "ECA"}</span>
        <h3 className="eca-card__title">{a.activityName}</h3>
        {meta && <p className="eca-card__meta">{meta}</p>}
        {a.description && <p className="eca-card__description">{a.description}</p>}
        {skills.length > 0 && (
          <div className="eca-card__tags">
            {skills.slice(0, 4).map((skill: string) => (
              <span key={skill} className="eca-card__tag">
                {skill}
              </span>
            ))}
            {skills.length > 4 && <span className="eca-card__tag">+{skills.length - 4}</span>}
          </div>
        )}
      </div>
    </>
  );

  const className = "eca-card";

  // With a gallery, the cover opens the full set in a new tab. Without one the
  // card is not a link, so it must not advertise itself as clickable.
  return cover ? (
    <a className={className} href={getImageUrl(cover)} target="_blank" rel="noopener noreferrer" style={style}>
      {body}
    </a>
  ) : (
    <div className={className} style={style}>
      {body}
    </div>
  );
}
