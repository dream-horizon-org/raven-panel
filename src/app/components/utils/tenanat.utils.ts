export const getOrganizations = (): readonly string[] => {
  const orgsEnv = process.env.NEXT_PUBLIC_ORGANIZATIONS;
  if (orgsEnv) {
    return orgsEnv
      .split(",")
      .map((org) => org.trim())
      .filter(Boolean) as readonly string[];
  }
  return [""] as const;
};
