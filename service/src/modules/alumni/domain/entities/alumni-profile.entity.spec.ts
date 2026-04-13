import { AlumniProfileDraft } from "./alumni-profile.entity";

describe("AlumniProfileDraft", () => {
  it("normalizes profile fields for update", () => {
    const draft = AlumniProfileDraft.create(
      {
        nickname: "  taro  ",
        companyNames: [" ACME ", "", "ACME", "Beta"],
        contactEmail: "  user@example.com ",
        isPublic: true,
        acceptContact: true,
        skills: [" React ", "Node", "React", "TypeScript"],
        portfolioUrl: "  https://example.com  ",
        gakuchika: "  project  ",
        entryTrigger: "  学校求人 ",
        interviewTip: "  tip  ",
        usefulCoursework: "  coursework  ",
      },
      "fallback@example.com",
    );

    expect(draft.toData()).toEqual({
      nickname: "taro",
      companyNames: ["ACME", "Beta"],
      contactEmail: "user@example.com",
      isPublic: true,
      acceptContact: true,
      skills: ["React", "Node", "TypeScript"],
      portfolioUrl: "https://example.com",
      gakuchika: "project",
      entryTrigger: "学校求人",
      interviewTip: "tip",
      usefulCoursework: "coursework",
    });
  });

  it("throws when isPublic=true without nickname", () => {
    expect(() =>
      AlumniProfileDraft.create(
        {
          nickname: "   ",
          companyNames: ["ACME"],
          isPublic: true,
        },
        "fallback@example.com",
      ),
    ).toThrow("nickname is required when isPublic is true");
  });
});
