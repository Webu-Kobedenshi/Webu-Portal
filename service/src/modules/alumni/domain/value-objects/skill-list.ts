export class SkillList {
  private constructor(private readonly values: string[]) {}

  static from(values: string[] | undefined): SkillList {
    const normalized = Array.from(
      new Set((values ?? []).map((value) => value.trim()).filter((value) => value.length > 0)),
    ).slice(0, 3);

    return new SkillList(normalized);
  }

  toArray(): string[] {
    return [...this.values];
  }
}
