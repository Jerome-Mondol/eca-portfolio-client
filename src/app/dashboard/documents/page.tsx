import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const docs = [
  { name: "FullStack_Certificate.pdf", size: "2.4 MB", date: "Aug 12", cat: "Certificates" },
  { name: "Robotics_Poster.png", size: "1.1 MB", date: "Jul 28", cat: "Awards" },
  { name: "Internship_Offer.pdf", size: "0.8 MB", date: "Jan 05", cat: "Projects" },
  { name: "Hackathon_Team.jpg", size: "3.2 MB", date: "Mar 14", cat: "Other" },
];

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Documents</h1>
          <p className="text-sm text-[#6b6b76]">One library, reuse everywhere.</p>
        </div>
        <Button>Upload document</Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["All", "Certificates", "Projects", "Awards", "Other"].map((c) => (
          <span key={c} className={`text-xs rounded-full px-3 py-1.5 border font-medium ${c === "All" ? "bg-[#111827] text-white border-[#111827]" : "bg-white border-[#e8e8ea]"}`}>{c}</span>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {docs.map((d) => (
          <Card key={d.name} className="p-4">
            <div className="flex items-start justify-between">
              <Badge>{d.cat}</Badge>
              <span className="text-xs text-[#8a8a94]">{d.date}</span>
            </div>
            <p className="text-sm font-medium mt-3 truncate">{d.name}</p>
            <p className="text-xs text-[#6b6b76]">{d.size} • Uploaded {d.date}</p>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="secondary" className="flex-1">Preview</Button>
              <Button size="sm" variant="ghost" className="flex-1">Download</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
