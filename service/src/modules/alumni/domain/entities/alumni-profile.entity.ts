import { resolveProfileVisibility } from "../alumni-profile-policy";
import { DomainValidationError } from "../errors/domain-validation.error";
import { CompanyNameCollection } from "../value-objects/company-name";
import { EmailAddress } from "../value-objects/email";
import { SkillList } from "../value-objects/skill-list";

export type AlumniProfileDraftInput = {
  nickname?: string;
  companyNames: string[];
  contactEmail?: string;
  isPublic?: boolean;
  acceptContact?: boolean;
  skills?: string[];
  portfolioUrl?: string;
  gakuchika?: string;
  entryTrigger?: string;
  interviewTip?: string;
  usefulCoursework?: string;
};

export type AlumniProfileDraftData = {
  nickname?: string;
  companyNames: string[];
  contactEmail: string;
  isPublic: boolean;
  acceptContact: boolean;
  skills: string[];
  portfolioUrl?: string;
  gakuchika?: string;
  entryTrigger?: string;
  interviewTip?: string;
  usefulCoursework?: string;
};

export class AlumniProfileDraft {
  private constructor(private readonly data: AlumniProfileDraftData) {}

  static create(input: AlumniProfileDraftInput, fallbackEmail: string): AlumniProfileDraft {
    const { isPublic, acceptContact } = resolveProfileVisibility({
      isPublic: input.isPublic,
      acceptContact: input.acceptContact,
    });

    const draft = new AlumniProfileDraft({
      nickname: input.nickname !== undefined ? input.nickname.trim() : undefined,
      companyNames: CompanyNameCollection.from(input.companyNames).toArray(),
      contactEmail: EmailAddress.resolve(input.contactEmail, fallbackEmail).toString(),
      isPublic,
      acceptContact: isPublic ? acceptContact : false,
      skills: SkillList.from(input.skills).toArray(),
      portfolioUrl: input.portfolioUrl !== undefined ? input.portfolioUrl.trim() : undefined,
      gakuchika: input.gakuchika !== undefined ? input.gakuchika.trim() : undefined,
      entryTrigger: input.entryTrigger !== undefined ? input.entryTrigger.trim() : undefined,
      interviewTip: input.interviewTip !== undefined ? input.interviewTip.trim() : undefined,
      usefulCoursework:
        input.usefulCoursework !== undefined ? input.usefulCoursework.trim() : undefined,
    });

    draft.assertPublishable();

    return draft;
  }

  toData(): AlumniProfileDraftData {
    return {
      ...this.data,
      companyNames: [...this.data.companyNames],
      skills: [...this.data.skills],
    };
  }

  private assertPublishable() {
    if (this.data.isPublic && this.data.companyNames.length === 0) {
      throw new DomainValidationError(
        "companyNames must contain at least one item when isPublic is true",
      );
    }

    if (this.data.isPublic && !this.data.nickname) {
      throw new DomainValidationError("nickname is required when isPublic is true");
    }
  }
}
