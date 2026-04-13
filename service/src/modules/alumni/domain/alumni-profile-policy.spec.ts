import { resolveProfileVisibility } from "./alumni-profile-policy";

describe("resolveProfileVisibility", () => {
  it("uses defaults when undefined", () => {
    expect(resolveProfileVisibility({})).toEqual({
      isPublic: true,
      acceptContact: true,
    });
  });

  it("keeps explicit values", () => {
    expect(resolveProfileVisibility({ isPublic: false, acceptContact: false })).toEqual({
      isPublic: false,
      acceptContact: false,
    });
  });
});
