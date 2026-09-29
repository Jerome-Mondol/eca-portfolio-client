import { Card } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/input";

type ProfileFieldsProps = {
  fullName: string;
  onFullNameChange: (value: string) => void;
  username: string;
  headline: string;
  onHeadlineChange: (value: string) => void;
  location: string;
  onLocationChange: (value: string) => void;
  bio: string;
  onBioChange: (value: string) => void;
  degree: string;
  onDegreeChange: (value: string) => void;
  institution: string;
  onInstitutionChange: (value: string) => void;
};

/** Basic information and education cards. */
export function ProfileFields(props: ProfileFieldsProps) {
  return (
    <div className="space-y-4">
      <Card className="p-5 space-y-4">
        <h3 className="font-semibold text-sm">Basic information</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Full name *</Label>
            <Input value={props.fullName} onChange={(e) => props.onFullNameChange(e.target.value)} placeholder="John Doe" className="mt-1.5" />
            <p className="text-xs text-muted-foreground mt-1">Editable — updates everywhere.</p>
          </div>
          <div>
            <Label>Username</Label>
            <Input value={props.username} disabled className="mt-1.5 bg-surface-2" />
            <p className="text-xs text-muted-foreground mt-1">Your portfolio URL</p>
          </div>
          <div>
            <Label>Headline</Label>
            <Input value={props.headline} onChange={(e) => props.onHeadlineChange(e.target.value)} placeholder="Computer Science Student" className="mt-1.5" />
          </div>
          <div>
            <Label>Location</Label>
            <Input value={props.location} onChange={(e) => props.onLocationChange(e.target.value)} placeholder="Dhaka, Bangladesh" className="mt-1.5" />
          </div>
        </div>
        <div>
          <Label>Bio</Label>
          <Textarea value={props.bio} onChange={(e) => props.onBioChange(e.target.value)} placeholder="Short bio for your portfolio" className="mt-1.5" />
        </div>
      </Card>

      <Card className="p-5 space-y-4">
        <h3 className="font-semibold text-sm">Education</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Degree</Label>
            <Input value={props.degree} onChange={(e) => props.onDegreeChange(e.target.value)} placeholder="BSc in Computer Science" className="mt-1.5" />
          </div>
          <div>
            <Label>Institution</Label>
            <Input value={props.institution} onChange={(e) => props.onInstitutionChange(e.target.value)} placeholder="University of Dhaka" className="mt-1.5" />
          </div>
        </div>
      </Card>
    </div>
  );
}
