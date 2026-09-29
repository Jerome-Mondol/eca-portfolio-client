"use client";

import { useRef, useState } from "react";
import { Download, Loader2 } from "lucide-react";

type PortfolioStatsCardProps = {
  fullName: string;
  username: string;
  headline: string;
  location?: string;
  projectCount: number;
  achievementCount: number;
  certificateCount: number;
  skillCount: number;
};

function twoDigits(value: number) {
  return String(value).padStart(2, "0");
}

export function PortfolioStatsCard({
  fullName,
  username,
  headline,
  location,
  projectCount,
  achievementCount,
  certificateCount,
  skillCount,
}: PortfolioStatsCardProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [message, setMessage] = useState("");

  const downloadPng = async () => {
    const svg = svgRef.current;
    if (!svg || downloading) return;
    setDownloading(true);
    setMessage("");

    let svgUrl = "";
    try {
      const source = new XMLSerializer().serializeToString(svg);
      svgUrl = URL.createObjectURL(new Blob([source], { type: "image/svg+xml;charset=utf-8" }));
      const image = new Image();
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error("The stats card could not be rendered."));
        image.src = svgUrl;
      });

      const canvas = document.createElement("canvas");
      canvas.width = 2400;
      canvas.height = 1260;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Your browser could not create the image.");
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      const png = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((result) => result ? resolve(result) : reject(new Error("The PNG could not be created.")), "image/png");
      });
      const downloadUrl = URL.createObjectURL(png);
      const link = document.createElement("a");
      const fileName = username.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "portfolio";
      link.href = downloadUrl;
      link.download = `${fileName}-proofolio-stats.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
      setMessage("Downloaded as a 2400 x 1260 PNG.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not download the stats card.");
    } finally {
      if (svgUrl) URL.revokeObjectURL(svgUrl);
      setDownloading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const displayName = (fullName || username).trim();
  const cardName = displayName.length > 21 ? `${displayName.slice(0, 18)}...` : displayName;
  const stats = [
    { number: twoDigits(projectCount), label: "Projects" },
    { number: twoDigits(achievementCount), label: "Honors" },
    { number: twoDigits(certificateCount), label: "Certificates" },
    { number: twoDigits(skillCount), label: "Skills" },
  ];

  return (
    <section className="mx-auto max-w-[1080px] px-3 sm:px-6 py-5 sm:py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ad4328]">Made to share</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">A snapshot of your work</h2>
          <p className="mt-1 text-sm text-muted">Download a branded portfolio stats card.</p>
        </div>
        <button
          type="button"
          onClick={downloadPng}
          disabled={downloading}
          className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-full bg-[#a93c22] px-5 text-sm font-semibold text-white transition hover:bg-[#873019] disabled:cursor-wait disabled:opacity-70 sm:self-auto"
        >
          {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          {downloading ? "Preparing card..." : "Download PNG"}
        </button>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-[#d9cfbd] bg-[#f3eddf] shadow-sm">
        <svg
          ref={svgRef}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 630"
          role="img"
          aria-labelledby="portfolio-stats-title portfolio-stats-description"
          className="block h-auto w-full"
        >
          <title id="portfolio-stats-title">{fullName}&apos;s Proofolio stats card</title>
          <desc id="portfolio-stats-description">A downloadable summary of projects, honors, certificates, and skills.</desc>
          <rect width="1200" height="630" fill="#f3eddf" />
          <rect x="24" y="24" width="1152" height="582" rx="18" fill="none" stroke="#c9bdab" strokeWidth="2" />
          <rect x="24" y="24" width="1152" height="8" rx="4" fill="#ad4328" />

          <rect x="64" y="62" width="34" height="34" rx="7" fill="#ad4328" />
          <text x="81" y="86" textAnchor="middle" fill="#fffaf0" fontFamily="Georgia, serif" fontSize="25" fontWeight="700">P</text>
          <text x="112" y="86" fill="#202522" fontFamily="Arial, Helvetica, sans-serif" fontSize="22" fontWeight="700" letterSpacing="1.3">PROOFOLIO</text>
          <text x="1136" y="84" textAnchor="end" fill="#746b5d" fontFamily="Arial, Helvetica, sans-serif" fontSize="13" fontWeight="700" letterSpacing="2.2">PORTFOLIO / {currentYear}</text>
          <line x1="64" y1="116" x2="1136" y2="116" stroke="#c9bdab" strokeWidth="1.5" />

          <text x="68" y="174" fill="#ad4328" fontFamily="Arial, Helvetica, sans-serif" fontSize="13" fontWeight="700" letterSpacing="3">STUDENT PORTFOLIO</text>
          <text x="64" y="250" fill="#202522" fontFamily="Georgia, 'Times New Roman', serif" fontSize="48" fontWeight="700">{cardName}</text>
          <text x="68" y="296" fill="#4e514b" fontFamily="Arial, Helvetica, sans-serif" fontSize="23">{headline.slice(0, 48)}</text>
          {location && <text x="68" y="336" fill="#746b5d" fontFamily="Arial, Helvetica, sans-serif" fontSize="18">{location.slice(0, 42)}</text>}
          <line x1="68" y1="398" x2="590" y2="398" stroke="#c9bdab" strokeWidth="1.5" />
          <text x="68" y="440" fill="#746b5d" fontFamily="Arial, Helvetica, sans-serif" fontSize="15" letterSpacing="0.7">A RECORD OF WHAT I HAVE LEARNED AND BUILT</text>
          <text x="68" y="552" fill="#202522" fontFamily="Arial, Helvetica, sans-serif" fontSize="18" fontWeight="700">proofolio.com/u/{username.slice(0, 38)}</text>
          <text x="68" y="580" fill="#8a8174" fontFamily="Arial, Helvetica, sans-serif" fontSize="13">Share the work behind the numbers.</text>

          <line x1="638" y1="150" x2="638" y2="552" stroke="#c9bdab" strokeWidth="1.5" />
          {stats.map((stat, index) => {
            const x = index % 2 === 0 ? 682 : 914;
            const y = index < 2 ? 157 : 355;
            const number = index + 1;
            return (
              <g key={stat.label}>
                <rect x={x} y={y} width="204" height="168" rx="12" fill="#eee5d5" stroke="#d1c5b3" strokeWidth="1.5" />
                <text x={x + 18} y={y + 30} fill="#ad4328" fontFamily="Arial, Helvetica, sans-serif" fontSize="12" fontWeight="700" letterSpacing="1.8">0{number} / 04</text>
                <text x={x + 18} y={y + 104} fill="#202522" fontFamily="Georgia, 'Times New Roman', serif" fontSize="57" fontWeight="700">{stat.number}</text>
                <text x={x + 18} y={y + 140} fill="#625d54" fontFamily="Arial, Helvetica, sans-serif" fontSize="14" fontWeight="700" letterSpacing="1.1">{stat.label.toUpperCase()}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <p aria-live="polite" className="mt-2 min-h-5 text-xs text-muted">{message || "PNG image | 2400 x 1260 | warm paper, ink, and Proofolio red."}</p>
    </section>
  );
}