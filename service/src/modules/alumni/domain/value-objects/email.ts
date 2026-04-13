export class EmailAddress {
  private constructor(private readonly value: string) {}

  static resolve(preferred: string | undefined, fallback: string): EmailAddress {
    const normalizedPreferred = preferred?.trim();
    if (normalizedPreferred) {
      return new EmailAddress(normalizedPreferred);
    }

    return new EmailAddress(fallback.trim());
  }

  toString(): string {
    return this.value;
  }
}
