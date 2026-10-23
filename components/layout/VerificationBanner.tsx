"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import VerificationModal from "@/components/features/profile/VerificationModal";

export default function VerificationBanner() {
  const { user, refreshUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (user?.identityVerified) return null;

  return (
    <>
      <div className="w-full bg-primary-green rounded-[35px] p-5 flex flex-col gap-3">
        <p className="font-raleway font-semibold text-[14px] text-white leading-snug">
          Verify your identity to unlock secure payments, legal agreements, and
          other protected features
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
        onSuccess={() => { setIsModalOpen(false); refreshUser(); }}
        defaultFirstName={(user as any)?.firstName ?? ""}
        defaultLastName={(user as any)?.lastName ?? ""}
      />
    </>
  );
}
