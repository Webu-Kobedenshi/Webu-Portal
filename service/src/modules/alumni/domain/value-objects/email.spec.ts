import { EmailAddress } from "./email";

describe("EmailAddress", () => {
  it("resolves preferred email when provided", () => {
    const email = EmailAddress.resolve("  user@example.com  ", "fallback@example.com");

    expect(email.toString()).toBe("user@example.com");
  });

  it("falls back when preferred is undefined", () => {
    const email = EmailAddress.resolve(undefined, "  fallback@example.com  ");

    expect(email.toString()).toBe("fallback@example.com");
  });

  it("falls back when preferred is empty", () => {
    const email = EmailAddress.resolve("   ", "fallback@example.com");

    expect(email.toString()).toBe("fallback@example.com");
  });
});
