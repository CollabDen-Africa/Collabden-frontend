"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useVerificationRequirement } from "@/hooks/verification/useVerificationRequirement";
import VerificationModal from "@/components/features/profile/VerificationModal";

export default function WorkspaceVerificationBanner() {
  const { user, refreshUser } = useAuth();
  const { projectDetails, activeProject } = useWorkspace();
  const project = projectDetails || activeProject;
  const { required, reason, isVerified } = useVerificationRequirement(project);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!required || isVerified) return null;

  const copy =
    reason === "owner_locking_escrow"
      ? "Verify your identity to lock escrow and release funds to collaborators."
      : "The project owner has funded this project. Verify your identity to receive your allocated payouts.";

  return (
    <>
      <div className="w-full bg-primary-green rounded-[35px] p-5 flex flex-col gap-3 mb-6">
        <p className="font-raleway font-semibold text-[14px] text-white leading-snug">
          {copy}
        </p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-white text-primary-green font-raleway font-bold text-[13px] py-2.5 px-5 rounded-full flex items-center justify-center gap-2 hover:bg-white/90 transition-colors"
        >
          Verify Your Identity
          <span className="w-2 h-2 rounded-full bg-primary-green shrink-0" />
        </button>
      </div>

      <VerificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          refreshUser();
        }}
        defaultFirstName={(user as any)?.firstName ?? ""}
        defaultLastName={(user as any)?.lastName ?? ""}
      />
    </>
  );
}
