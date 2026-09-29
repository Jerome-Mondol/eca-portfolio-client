import { ProfileFields } from "./profile-fields";
import { ProfileSocialsCard, type SocialsCardState } from "./profile-socials-card";

type ProfileEditorProps = {
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
  socials: SocialsCardState;
  interests: string[];
  newInterest: string;
  onNewInterestChange: (value: string) => void;
  onAddInterest: () => void;
  onRemoveInterest: (interest: string) => void;
};

/** The editable right-hand column: fields, then socials and interests. */
export function ProfileEditor(props: ProfileEditorProps) {
  return (
    <div className="space-y-4">
      <ProfileFields
        fullName={props.fullName}
        onFullNameChange={props.onFullNameChange}
        username={props.username}
        headline={props.headline}
        onHeadlineChange={props.onHeadlineChange}
        location={props.location}
        onLocationChange={props.onLocationChange}
        bio={props.bio}
        onBioChange={props.onBioChange}
        degree={props.degree}
        onDegreeChange={props.onDegreeChange}
        institution={props.institution}
        onInstitutionChange={props.onInstitutionChange}
      />

      <ProfileSocialsCard
        {...props.socials}
        interests={props.interests}
        newInterest={props.newInterest}
        onNewInterestChange={props.onNewInterestChange}
        onAddInterest={props.onAddInterest}
        onRemoveInterest={props.onRemoveInterest}
      />
    </div>
  );
}
