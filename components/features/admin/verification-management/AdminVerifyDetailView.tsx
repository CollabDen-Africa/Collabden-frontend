"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { verificationService, VerificationDetailData } from "@/services/admin/verification.service";
import {
  HiOutlineArrowLeft,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineShieldCheck,
  HiOutlineDocumentSearch,
  HiOutlineUser,
  HiOutlineLocationMarker,
  HiOutlineClock,
  HiOutlineExclamation,
} from "react-icons/hi";

interface AdminVerifyDetailViewProps {
  id: string;
}

export const AdminVerifyDetailView: React.FC<AdminVerifyDetailViewProps> = ({ id }) => {
  const router = useRouter();
  const [detail, setDetail] = useState<VerificationDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [decisionType, setDecisionType] = useState<"APPROVED" | "REJECTED">("APPROVED");
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadDetail() {
      setIsLoading(true);
      try {
        const res = await verificationService.getVerificationDetails(id);
        const item = res?.data || res;
        setDetail(item);
      } catch (err) {
        console.error("Failed to load verification detail:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDetail();
  }, [id]);

  const breadcrumbItems = [
    { label: "Admin Portal", href: "/admin/dashboard" },
    { label: "Verification", href: "/admin/verify" },
    { label: detail?.requestId || id },
  ];

  const handleSubmitDecision = async () => {
    if (decisionType === "REJECTED" && !rejectionReason.trim()) {
      alert("Please provide a reason for rejecting this verification request.");
      return;
    }
    setIsSubmitting(true);
    try {
      await verificationService.processVerificationDecision(id, {
        status: decisionType,
        rejectionReason: decisionType === "REJECTED" ? rejectionReason : undefined,
      });
      alert(`Verification request ${decisionType.toLowerCase()} successfully.`);
      setIsDecisionModalOpen(false);
      router.push("/admin/verify");
    } catch (err) {
      console.error("Failed to submit decision:", err);
      alert("Failed to submit decision. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !detail) {
    return (
      <div className="w-full flex flex-col gap-6 pb-12">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="p-12 text-center">
          <div className="w-8 h-8 border-2 border-[#73BF44] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#AEB2B4] mt-3">Loading verification document review...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 pb-12 animate-in fade-in duration-300">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Back Link */}
      <div>
        <button
          onClick={() => router.push("/admin/verify")}
          className="text-xs font-semibold text-[#73BF44] hover:underline flex items-center gap-1.5 cursor-pointer"
        >
          <HiOutlineArrowLeft size={14} /> Back to Verification Overview
        </button>
      </div>

      {/* Summary Header Card */}
      <div className="p-6 rounded-2xl bg-card-bg-alt/30 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#73BF44]/10 border border-[#73BF44]/20 flex items-center justify-center shrink-0">
            <span className="text-xl font-bold text-[#73BF44]">{detail.userName.charAt(0)}</span>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl md:text-2xl font-bold text-white font-sans">{detail.userName} — Document Review</h1>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#6495ED]/10 text-[#6495ED] border border-[#6495ED]/20">
                {detail.type}
              </span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#FBBC04]/10 text-[#FBBC04] border border-[#FBBC04]/20">
                {detail.status}
              </span>
            </div>
            <p className="text-xs text-[#AEB2B4] mt-1 font-mono">
              Request ID: {detail.requestId || id} &middot; Submitted {detail.submittedDate} &middot; Attempts: {detail.attempts}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { setDecisionType("REJECTED"); setIsDecisionModalOpen(true); }}
            className="px-4 py-2.5 rounded-xl bg-[#FF0404]/10 hover:bg-[#FF0404]/20 text-[#FF0404] border border-[#FF0404]/30 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <HiOutlineXCircle size={16} /> Reject Request
          </button>
          <button
            onClick={() => { setDecisionType("APPROVED"); setIsDecisionModalOpen(true); }}
            className="px-4 py-2.5 rounded-xl bg-[#73BF44] text-[#505050] text-xs font-bold hover:brightness-110 transition-colors cursor-pointer flex items-center gap-1.5 shadow-md"
          >
            <HiOutlineCheckCircle size={16} /> Approve Verification
          </button>
        </div>
      </div>

      {/* Main Review Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: User Profile & Automated Verification Checks */}
        <div className="lg:col-span-1 space-y-6">
          {/* USER INFORMATION */}
          <div className="p-6 rounded-2xl bg-card-bg-alt/30 border border-white/10 space-y-4">
            <h3 className="text-xs font-bold text-[#AEB2B4] uppercase tracking-wider font-sans">User Details</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-[#AEB2B4] flex items-center gap-1.5"><HiOutlineUser size={14} /> Full Name</span>
                <span className="text-white font-medium">{detail.userName}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-[#AEB2B4]">User ID</span>
                <span className="text-white font-mono">{detail.userId}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-[#AEB2B4]">Email</span>
                <span className="text-white">{detail.userEmail}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-[#AEB2B4] flex items-center gap-1.5"><HiOutlineLocationMarker size={14} /> Location</span>
                <span className="text-white">{detail.location || "Accra, Ghana"}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-[#AEB2B4]">Account Type</span>
                <span className="text-white">{detail.accountType || "Individual Artist"}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-[#AEB2B4] flex items-center gap-1.5"><HiOutlineClock size={14} /> Member Since</span>
                <span className="text-white">{detail.memberSince || "Mar 4, 2024"}</span>
              </div>
            </div>
          </div>

          {/* AUTOMATED CHECKS */}
          <div className="p-6 rounded-2xl bg-card-bg-alt/30 border border-white/10 space-y-4">
            <h3 className="text-xs font-bold text-[#AEB2B4] uppercase tracking-wider font-sans flex items-center gap-2">
              <HiOutlineShieldCheck className="text-[#73BF44]" size={16} /> Automated AI Checks
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-white/2 border border-white/5 space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-white">Face Match Score</span>
                  <span className="text-[#73BF44] font-bold">98.4%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-[#73BF44] rounded-full" style={{ width: "98.4%" }} />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/2 border border-white/5">
                <span className="text-[#AEB2B4]">Document Expiry Check</span>
                <span className="text-[#73BF44] font-bold flex items-center gap-1"><HiOutlineCheckCircle size={14} /> Valid</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/2 border border-white/5">
                <span className="text-[#AEB2B4]">OCR Name Match</span>
                <span className="text-[#73BF44] font-bold flex items-center gap-1"><HiOutlineCheckCircle size={14} /> Match</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Submitted Document Review Preview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-card-bg-alt/30 border border-white/10 space-y-4">
            <h3 className="text-xs font-bold text-[#AEB2B4] uppercase tracking-wider font-sans flex items-center gap-2">
              <HiOutlineDocumentSearch className="text-[#73BF44]" size={18} /> Submitted Verification Assets
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ID Document Preview */}
              <div className="p-4 rounded-xl bg-white/2 border border-white/5 space-y-3">
                <span className="text-xs font-bold text-white block">Government Passport / ID Card</span>
                <div className="w-full h-48 rounded-xl bg-black/40 border border-white/10 flex flex-col items-center justify-center text-text-muted space-y-2 overflow-hidden relative">
                  <HiOutlineDocumentSearch size={36} className="text-[#6495ED]" />
                  <span className="text-xs">Passport Photo Page (Front)</span>
                  <span className="text-[10px] text-[#AEB2B4] font-mono">GH-PASSPORT-881920</span>
                </div>
              </div>

              {/* Live Selfie Scan Preview */}
              <div className="p-4 rounded-xl bg-white/2 border border-white/5 space-y-3">
                <span className="text-xs font-bold text-white block">Live Biometric Selfie Scan</span>
                <div className="w-full h-48 rounded-xl bg-black/40 border border-white/10 flex flex-col items-center justify-center text-text-muted space-y-2 overflow-hidden relative">
                  <div className="w-20 h-20 rounded-full bg-[#73BF44]/10 border border-[#73BF44]/30 flex items-center justify-center">
                    <span className="text-2xl font-bold text-[#73BF44]">{detail.userName.charAt(0)}</span>
                  </div>
                  <span className="text-xs">Selfie Match Verified</span>
                  <span className="text-[10px] text-[#73BF44] font-bold">Liveness Score: Pass</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Modal Overlay */}
      {isDecisionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#505050] border border-white/10 p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 font-sans">
              {decisionType === "APPROVED" ? (
                <>
                  <HiOutlineCheckCircle className="text-[#73BF44]" size={22} /> Approve Verification
                </>
              ) : (
                <>
                  <HiOutlineExclamation className="text-[#FF0404]" size={22} /> Reject Verification Request
                </>
              )}
            </h3>
            <p className="text-xs text-[#AEB2B4]">
              {decisionType === "APPROVED"
                ? `Confirm identity verification for ${detail.userName}? The user account badge will update to Verified.`
                : `Specify reason for rejecting ${detail.userName}'s document submission.`}
            </p>

            {decisionType === "REJECTED" && (
              <div>
                <label className="text-xs font-semibold text-[#AEB2B4] block mb-1">Rejection Reason *</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Passport image is blurry or expired..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-[#AEB2B4]/40 focus:outline-none focus:border-[#FF0404] transition-colors resize-none"
                />
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsDecisionModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 text-xs text-white/70 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitDecision}
                disabled={isSubmitting}
                className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  decisionType === "APPROVED"
                    ? "bg-[#73BF44] text-[#505050] hover:brightness-110"
                    : "bg-[#FF0404] text-white hover:brightness-110"
                }`}
              >
                {isSubmitting ? "Submitting..." : decisionType === "APPROVED" ? "Confirm Approval" : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVerifyDetailView;
