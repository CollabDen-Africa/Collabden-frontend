import { useMemo } from "react";
import { useEscrow } from "@/hooks/escrow/useEscrow";
import type { Project } from "@/types/api.types";

export type ProjectFundingStatus = "funded" | "unfunded";

export interface ProjectFundingResult {
  status: ProjectFundingStatus;
  escrowLocked: boolean;
  isLoading: boolean;
}

/**
 * A project is "funded" when the owner has committed money to it via escrow.
 * Wallet balance alone doesn't count — it's global, not project-scoped.
 * Projects explicitly marked VOLUNTEER are always unfunded.
 */
export function useProjectFundingStatus(
  project: Project | null | undefined
): ProjectFundingResult {
  const { useProjectEscrow } = useEscrow();
  const projectId = project?.id || "";
  const { data: escrow, isLoading } = useProjectEscrow(projectId);

  return useMemo(() => {
    if (!project) {
      return { status: "unfunded", escrowLocked: false, isLoading };
    }

    if ((project.pricingType || "").toUpperCase() === "VOLUNTEER") {
      return { status: "unfunded", escrowLocked: false, isLoading };
    }

    const hasEscrow = Boolean(escrow?.id);
    const escrowLocked =
      escrow?.status === "FUNDED" ||
      escrow?.status === "LOCKED" ||
      escrow?.status === "COMPLETED";

    return {
      status: hasEscrow ? "funded" : "unfunded",
      escrowLocked,
      isLoading,
    };
  }, [project, escrow, isLoading]);
}
