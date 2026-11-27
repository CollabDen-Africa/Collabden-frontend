export type DisplayNameMode = "LEGAL" | "STAGE";

export interface DisplayableUser {
  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  email?: string | null;
  displayNameMode?: DisplayNameMode | null;
}

const joinName = (first?: string | null, last?: string | null) =>
  [first, last].filter(Boolean).join(" ").trim();

const emailLocalPart = (email?: string | null) =>
  email ? email.split("@")[0] : "";

/**
 * Resolve the name to show for a user, respecting their displayNameMode setting.
 * STAGE → prefer displayName; LEGAL (default) → prefer firstName + lastName.
 * Falls back to the other name field, then the email local part, then the `fallback` arg.
 */
export function resolveUserName(user: DisplayableUser | null | undefined, fallback = "User"): string {
  if (!user) return fallback;
  const legal = joinName(user.firstName, user.lastName);
  const stage = user.displayName?.trim() || "";
  const mode = user.displayNameMode === "STAGE" ? "STAGE" : "LEGAL";

  if (mode === "STAGE") {
    return stage || legal || emailLocalPart(user.email) || fallback;
  }
  return legal || stage || emailLocalPart(user.email) || fallback;
}
