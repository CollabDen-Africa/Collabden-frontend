import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useEscrow } from "@/hooks/escrow/useEscrow";
import { useProjectFundingStatus } from "@/hooks/projects/useProjectFundingStatus";
import type { Project } from "@/types/api.types";

export type VerificationReason =
  | "owner_locking_escrow"
  | "collaborator_on_allocation"
  | null;

export interface VerificationRequirement {
  required: boolean;
  reason: VerificationReason;
  blocking: boolean;
  isVerified: boolean;
}

/**
 * Determines whether the current user should be prompted to verify their
 * identity in the context of a specific project.
 *
 * - Unfunded / volunteer project → never required.
 * - Funded project + user is owner → required, blocking (can't lock escrow).
 * - Funded project + user is on an allocation → required, non-blocking (soft banner).
 * - Otherwise → not required.
 */
export function useVerificationRequirement(
  project: Project | null | undefined
): VerificationRequirement {
  const { user } = useAuth();
  const { status } = useProjectFundingStatus(project);

  const { useProjectEscrow } = useEscrow();
  const { data: escrow } = useProjectEscrow(project?.id || "");

  return useMemo(() => {
    const isVerified = Boolean(user?.identityVerified);
    const base = { required: false, reason: null as VerificationReason, blocking: false, isVerified };

    if (!user || !project || status === "unfunded") return base;

    const ownerId = project.owner?.id || project.ownerId;
    const isOwner = ownerId === user.id;

    if (isOwner) {
      return { required: true, reason: "owner_locking_escrow", blocking: true, isVerified };
    }

    const hasAllocation = (escrow?.allocations || []).some(
      (a) => a.userId === user.id
    );
    if (hasAllocation) {
      return { required: true, reason: "collaborator_on_allocation", blocking: false, isVerified };
    }

    return base;
  }, [user, project, status, escrow]);
}
