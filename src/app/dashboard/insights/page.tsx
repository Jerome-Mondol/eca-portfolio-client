import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function InsightsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Insights • Know Yourself</h1>
        <p className="text-sm text-[#6b6b76]">Based on evidence. No scores.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="p-5">
          <h3 className="text-sm font-semibold">Skills demonstrated</h3>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {["Web Development", "Leadership", "Communication", "Project Management", "Problem Solving"].map((s) => (<Badge key={s}>{s}</Badge>))}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="text-sm font-semibold">Areas of experience</h3>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {["Technology", "Education", "Leadership", "Community"].map((s) => (<Badge key={s}>{s}</Badge>))}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="text-sm font-semibold">Activity patterns</h3>
          <p className="text-sm text-[#4a4a52] mt-2">You have participated in 7 technology-related activities and built 5 software projects.</p>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="text-sm font-semibold">Portfolio gaps</h3>
          <p className="text-sm text-[#4a4a52] mt-2">You have several technical projects but currently have limited information about your leadership or volunteering experience.</p>
          <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">Consider documenting your role in the university programming club.</div>
        </Card>
        <Card className="p-5">
          <h3 className="text-sm font-semibold">Suggested next steps</h3>
          <ul className="mt-2 space-y-1.5 text-sm text-[#4a4a52]">
            <li>• Add your volunteer experience from the Community Clean Drive</li>
            <li>• Complete the &quot;Skills&quot; section — currently 2 categories missing</li>
            <li>• Upload the Hackathon certificate for AI extraction</li>
          </ul>
        </Card>
      </div>

      <Card className="p-5">
        <h3 className="text-sm font-semibold">Portfolio completeness</h3>
        <div className="mt-3 h-2 rounded-full bg-[#f0f0f2] overflow-hidden"><div className="h-full bg-[#111827]" style={{ width: "72%" }} /></div>
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#111827]" /> Profile ✓</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#111827]" /> Projects ✓</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-white border" /> Skills ○</span>
        </div>
      </Card>
    </div>
  );
}
