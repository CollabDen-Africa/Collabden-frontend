"use client";

import React, { useState } from "react";
import { FiShield, FiLock, FiInfo } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import VerificationModal from "@/components/features/profile/VerificationModal";

interface VerificationPanelProps {
  isVerified: boolean;
  isPending?: boolean;
  profile?: any;
}

export default function VerificationPanel({
  isVerified,
  isPending = false,
  profile,
}: VerificationPanelProps) {
  const { user, refreshUser } = useAuth();
  const [localPending, setLocalPending] = useState(isPending);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const defaultFirstName = profile?.firstName || (user as any)?.firstName || "";
  const defaultLastName = profile?.lastName || (user as any)?.lastName || "";

  const userCreated = profile?.createdAt || (user as any)?.createdAt;
  const memberSince =
    userCreated && !isNaN(new Date(userCreated).getTime())
      ? new Date(userCreated).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : "Recently";

  const statusLabel = isVerified ? "Verified" : localPending ? "Under Review" : "Unverified";
  const statusColor = isVerified ? "text-primary-green" : localPending ? "text-accent-yellow" : "text-[#FC6B6B]";

  const fullName =
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
    profile?.legalName ||
    profile?.displayName ||
    [(user as any)?.firstName, (user as any)?.lastName].filter(Boolean).join(" ") ||
    "Not Set";

  const userIdDisplay = profile?.id
    ? `USR-${profile.id.substring(0, 6)}`
    : (user as any)?.id
      ? `USR-${(user as any).id.substring(0, 6)}`
      : "USR-----";

  const userEmail = profile?.email || (user as any)?.email || "Not Set";
  const accountType = profile?.role || (user as any)?.role || "Collaborator";

  // --- STATE 1: UNVERIFIED ---
  if (!isVerified && !localPending) {
    return (
      <>
        <div className="w-full bg-white/5 border-[0.8px] border-white/10 rounded-[18px] p-6 lg:p-8 flex flex-col gap-6 backdrop-blur-md">
          <div className="flex items-center gap-3 border-b border-white/10 pb-6">
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-white shrink-0">
              <FiShield size={24} />
            </div>
            <div className="flex flex-col">
              <h3 className="font-raleway font-bold text-[20px] text-white">Identity Verification</h3>
              <p className="font-inter text-[14px] text-white/50">
                Verify your identity to unlock secure payments, legal agreements, and other protected features.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-white/40">
              <FiLock size={12} className="text-primary-green shrink-0" />
              <span className="font-inter text-[12px]">Your data is encrypted and never shared.</span>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto bg-primary-green hover:bg-primary-green/90 text-white font-raleway font-semibold text-[14px] px-8 py-3 rounded-full transition-colors shadow-[0_4px_14px_rgba(115,191,68,0.25)]"
            >
              Verify My Identity
            </button>
          </div>
        </div>

        <VerificationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            setLocalPending(true);
            refreshUser();
          }}
          defaultFirstName={defaultFirstName}
          defaultLastName={defaultLastName}
        />
      </>
    );
  }

  // --- STATE 2 & 3: SUMMARY VIEW (Pending or Verified) ---
  return (
    <div className="w-full flex flex-col xl:flex-row gap-5 xl:gap-6">
      {/* LEFT COLUMN: User Information */}
      <div className="flex-1 bg-white/5 border-[0.8px] border-white/10 rounded-[18px] p-[20px] flex flex-col backdrop-blur-md">
        <h3 className="font-raleway font-bold text-[12px] uppercase tracking-[0.84px] text-white/45 mb-3">
          User Information
        </h3>

        <div className="flex flex-col w-full">
          <div className="flex justify-between items-center py-[9px] border-b border-white/10">
            <span className="font-inter text-[12px] text-white/45">Full Name</span>
            <span className="font-raleway font-semibold text-[12px] text-white">{fullName}</span>
          </div>
          <div className="flex justify-between items-center py-[9px] border-b border-white/10">
            <span className="font-inter text-[12px] text-white/45">User ID</span>
            <span className="font-raleway font-semibold text-[12px] text-accent-soft-blue">{userIdDisplay}</span>
          </div>
          <div className="flex justify-between items-center py-[9px] border-b border-white/10">
            <span className="font-inter text-[12px] text-white/45">Email</span>
            <span className="font-raleway font-semibold text-[12px] text-white">{userEmail}</span>
          </div>
          <div className="flex justify-between items-center py-[9px] border-b border-white/10">
            <span className="font-inter text-[12px] text-white/45">Account Type</span>
            <span className="font-raleway font-semibold text-[12px] text-white">{accountType}</span>
          </div>
          <div className="flex justify-between items-center py-[9px] border-b border-white/10">
            <span className="font-inter text-[12px] text-white/45">Member Since</span>
            <span className="font-raleway font-semibold text-[12px] text-white">{memberSince}</span>
          </div>
          <div className="flex justify-between items-center py-[9px]">
            <span className="font-inter text-[12px] text-white/45">Current Status</span>
            <span className={`font-raleway font-semibold text-[12px] ${statusColor}`}>{statusLabel}</span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Submitted Documents */}
      <div className="flex-1 bg-white/5 border-[0.8px] border-white/10 rounded-[18px] p-[20px] flex flex-col backdrop-blur-md">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-raleway font-bold text-[12px] uppercase tracking-[0.84px] text-white/45">
            Submitted Documents
          </h3>
          <div className="flex items-center gap-1.5 text-primary-green">
            <FiLock size={11} />
            <span className="font-inter font-semibold text-[10px]">Encrypted · Secure Access</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white/5 border border-white/10 rounded-[16px] overflow-hidden flex flex-col h-[166px]">
            <div className="flex-1 bg-gradient-to-br from-[#A78BFA]/10 to-[#A78BFA]/20 flex items-center justify-center relative">
              <FiShield size={32} className="text-[#A78BFA]" />
              <div className="absolute top-2 left-2 bg-white/5 border border-white/10 rounded-full px-2 py-0.5 flex items-center gap-1">
                <FiLock size={9} className="text-primary-green" />
                <span className="font-inter font-semibold text-[9px] text-primary-green">Encrypted</span>
              </div>
            </div>
            <div className="p-3 bg-transparent">
              <h4 className="font-raleway font-bold text-[12px] text-white">National ID (Front)</h4>
              <p className="font-inter text-[10px] text-white/45 mt-0.5">Submitted · Encrypted</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[16px] overflow-hidden flex flex-col h-[166px]">
            <div className="flex-1 bg-gradient-to-br from-[#A78BFA]/10 to-[#A78BFA]/20 flex items-center justify-center relative">
              <FiShield size={32} className="text-[#A78BFA]" />
              <div className="absolute top-2 left-2 bg-white/5 border border-white/10 rounded-full px-2 py-0.5 flex items-center gap-1">
                <FiLock size={9} className="text-primary-green" />
                <span className="font-inter font-semibold text-[9px] text-primary-green">Encrypted</span>
              </div>
            </div>
            <div className="p-3 bg-transparent">
              <h4 className="font-raleway font-bold text-[12px] text-white">National ID (Back)</h4>
              <p className="font-inter text-[10px] text-white/45 mt-0.5">Submitted · Encrypted</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[16px] overflow-hidden flex flex-col h-[166px]">
            <div className="flex-1 bg-gradient-to-br from-[#11EA9B]/10 to-[#11EA9B]/20 flex items-center justify-center relative">
              <FiShield size={32} className="text-accent-green-bright" />
              <div className="absolute top-2 left-2 bg-white/5 border border-white/10 rounded-full px-2 py-0.5 flex items-center gap-1">
                <FiLock size={9} className="text-primary-green" />
                <span className="font-inter font-semibold text-[9px] text-primary-green">Encrypted</span>
              </div>
            </div>
            <div className="p-3 bg-transparent">
              <h4 className="font-raleway font-bold text-[12px] text-white">Selfie Photo</h4>
              <p className="font-inter text-[10px] text-white/45 mt-0.5">Submitted · Encrypted</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[16px] overflow-hidden flex flex-col h-[166px]">
            <div className="flex-1 bg-gradient-to-br from-[#E2C806]/10 to-[#E2C806]/20 flex items-center justify-center relative">
              <FiShield size={32} className="text-accent-yellow" />
              <div className="absolute top-2 left-2 bg-white/5 border border-white/10 rounded-full px-2 py-0.5 flex items-center gap-1">
                <FiLock size={9} className="text-primary-green" />
                <span className="font-inter font-semibold text-[9px] text-primary-green">Encrypted</span>
              </div>
            </div>
            <div className="p-3 bg-transparent">
              <h4 className="font-raleway font-bold text-[12px] text-white">Proof of Address</h4>
              <p className="font-inter text-[10px] text-white/45 mt-0.5">Submitted · Encrypted</p>
            </div>
          </div>
        </div>

        <div className="bg-[#A78BFA]/5 border border-[#A78BFA]/20 rounded-[12px] p-3 flex items-start gap-2.5 mt-auto">
          <FiInfo size={14} className="text-[#A78BFA] shrink-0 mt-0.5" />
          <p className="font-inter text-[11px] leading-[18px] text-[#A78BFA]">
            Documents are encrypted and accessible only to Verification Admins during the review process.
          </p>
        </div>
      </div>
    </div>
  );
}
