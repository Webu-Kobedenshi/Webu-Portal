export type AlumniProfileVisibilityInput = {
  isPublic?: boolean;
  acceptContact?: boolean;
};

export type AlumniProfileVisibility = {
  isPublic: boolean;
  acceptContact: boolean;
};

export function resolveProfileVisibility(
  input: AlumniProfileVisibilityInput,
): AlumniProfileVisibility {
  return {
    isPublic: input.isPublic ?? true,
    acceptContact: input.acceptContact ?? true,
  };
}
