export type GraduationRuleInput = {
  enrollmentYear: number;
  durationYears: number;
  now?: Date;
};

export function calculateGraduationYear(enrollmentYear: number, durationYears: number): number {
  return enrollmentYear + durationYears;
}

export function isGraduatedAt(input: GraduationRuleInput): boolean {
  const currentYear = (input.now ?? new Date()).getFullYear();
  const graduationYear = calculateGraduationYear(input.enrollmentYear, input.durationYears);
  return currentYear >= graduationYear;
}
