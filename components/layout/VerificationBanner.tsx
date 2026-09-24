"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FiCheckCircle, FiLoader } from "react-icons/fi";

import personaService from "@/services/persona.service";

export default function VerificationBanner() {
  const { user, refreshUser } = useAuth();
  const searchParams = useSearchParams();
  const [justCompleted, setJustCompleted] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Detect when Persona redirects back with ?persona=complete
  useEffect(() => {
    const personaStatus = searchParams?.get("persona");
    if (personaStatus === "complete" && !user?.identityVerified) {
      setJustCompleted(true);
      setIsRefreshing(true);
      // Refresh user so identityVerified updates without a manual reload
      refreshUser().finally(() => setIsRefreshing(false));
    }
  }, [searchParams, user?.identityVerified, refreshUser]);

  // Hide banner if verified
  if (user?.identityVerified) return null;

  const handleVerify = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await personaService.createInquiry();
      const targetUrl = res.redirectUrl || `https://withpersona.com/verify?inquiry-id=${res.inquiryId}`;
      window.location.href = targetUrl;
    } catch (err: any) {
      console.error("Failed to start identity verification:", err);
      const msg =
        err?.response?.data?.details ||
        err?.response?.data?.error ||
        "Failed to launch verification session";
      setErrorMsg(msg);
      setIsLoading(false);
    }
  };

  // ── Returned from Persona, waiting for webhook to resolve ─────────────────
  if (justCompleted) {
    return (
      <div className="w-full bg-primary-green rounded-[30px] p-[24px_16px] flex flex-col gap-4 shadow-lg">
        <div className="flex items-center gap-2">
          {isRefreshing ? (
            <FiLoader className="text-white animate-spin" size={18} />
          ) : (
            <FiCheckCircle className="text-white" size={18} />
          )}
          <p className="font-raleway font-semibold text-[14px] text-white">
            {isRefreshing
              ? "Checking verification status..."
              : "Verification submitted! Your status will update shortly."}
          </p>
        </div>
        <p className="font-raleway font-normal text-[12px] text-white/80">
          Persona is processing your ID. This usually takes just a few seconds.
        </p>
      </div>
    );
  }

  // ── Default state ──────────────────────────────────────────────────────────
  return (
    <div className="w-full bg-primary-green rounded-[30px] p-[24px_16px] flex flex-col justify-end gap-4 shadow-lg">
      <p className="font-raleway font-normal text-[14px] text-white leading-5.75">
        Verify your identity to unlock secure payments, legal agreements, and
        other protected features
      </p>
      {errorMsg && (
        <p className="font-raleway text-[12px] text-red-200 bg-red-950/40 p-2 rounded-lg">
          {errorMsg}
        </p>
      )}
      <button
        id="verify-identity-btn"
        onClick={handleVerify}
        disabled={isLoading}
        className="bg-white rounded-full py-2 flex items-center justify-center gap-1.5 min-w-[132px] px-4 hover:bg-white/90 transition-colors disabled:opacity-75"
        aria-label="Start identity verification"
      >
        {isLoading ? (
          <FiLoader className="text-primary-green animate-spin" size={16} />
        ) : (
          <>
            <span className="font-raleway font-semibold text-[11px] text-primary-green tracking-wide text-nowrap">
              Verify Your Identity
            </span>
            <div className="w-2 h-2 bg-primary-green rounded-full" />
          </>
        )}
      </button>
    </div>
  );
}
