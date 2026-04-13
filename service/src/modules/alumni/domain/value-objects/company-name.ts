export class CompanyNameCollection {
  private constructor(private readonly values: string[]) {}

  static from(values: string[]): CompanyNameCollection {
    const normalized = Array.from(
      new Set(values.map((value) => value.trim()).filter((value) => value.length > 0)),
    );

    return new CompanyNameCollection(normalized);
  }

  toArray(): string[] {
    return [...this.values];
  }

  isEmpty(): boolean {
    return this.values.length === 0;
  }
}
