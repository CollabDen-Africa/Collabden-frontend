"use client";

import React, { useState } from "react";
import { FiLock, FiCheck, FiX, FiExternalLink, FiFileText, FiEdit3 } from "react-icons/fi";
import Button from "@/components/ui/Button";

interface SignAgreementOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSign: () => void;
  legalName?: string;
  isUserVerified?: boolean;
  isPending?: boolean;
  fileUrl?: string;
  agreementTitle?: string;
}

export default function SignAgreementOverlay({
  isOpen,
  onClose,
  onSign,
  legalName,
  isUserVerified = false,
  isPending = false,
  fileUrl,
  agreementTitle,
}: SignAgreementOverlayProps) {
  const [isChecked, setIsChecked] = useState(false);
  const [pdfError, setPdfError] = useState(false);

  if (!isOpen) return null;

  const handleSign = () => {
    if (!isChecked) return;
    onSign();
  };

  const displayName = legalName || "Awaiting Verification...";
  // isVerified comes from the user's identityVerified flag, not from whether
  // legalName string is present — KYC may set them independently
  const isVerified = isUserVerified;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
      <div className="fixed inset-0 bg-[#121A1F]/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-3xl max-h-[92vh] bg-white/10 border border-white/20 rounded-[40px] shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-300 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <FiEdit3 className="text-primary-green" size={22} />
            <h2 className="font-raleway font-semibold text-[20px] text-white leading-7.5">
              Sign Agreement
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center justify-center transition-colors group"
          >
            <FiX className="text-white/60 group-hover:text-white transition-colors" size={20} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex flex-col gap-6 px-8 pb-8 overflow-y-auto flex-1">

          {/* ── Contract Viewer ─────────────────────────────────── */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-raleway font-medium text-[14px] text-white/80">
                {agreementTitle || "Agreement Document"}
              </span>
              {fileUrl && (
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-primary-green hover:text-accent-green-bright transition-colors text-[13px] font-raleway font-medium"
                >
                  <FiExternalLink size={14} />
                  Open in new tab
                </a>
              )}
            </div>

            <div className="w-full rounded-[20px] overflow-hidden border border-white/10 bg-black/30 h-72 md:h-96 flex items-center justify-center">
              {fileUrl && !pdfError ? (
                <iframe
                  src={fileUrl}
                  title={agreementTitle || "Agreement"}
                  className="w-full h-full"
                  onError={() => setPdfError(true)}
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-white/40 p-6 text-center">
                  <FiFileText size={40} strokeWidth={1.5} />
                  <span className="font-raleway text-[14px]">
                    {pdfError
                      ? "Unable to preview PDF inline."
                      : "No document uploaded yet."}
                  </span>
                  {fileUrl && pdfError && (
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-primary-green hover:text-accent-green-bright transition-colors text-[13px] font-medium mt-1"
                    >
                      <FiExternalLink size={13} />
                      Open PDF to review
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Visual Signature Preview ─────────────────────────── */}
          <div className="flex flex-col gap-2">
            <label className="font-raleway font-medium text-[14px] text-white/80">
              Your Electronic Signature
            </label>

            {/* Signature box */}
            <div className="w-full bg-white/5 border border-white/20 rounded-[20px] px-6 py-5 flex flex-col gap-3">
              <div className="flex items-center gap-2 mb-1">
                <FiLock className="text-white/30" size={13} />
                <span className="font-raleway text-[12px] text-white/40">
                  Auto-filled from your verified profile — cannot be edited
                </span>
              </div>

              {/* Signature rendered in cursive style */}
              <div className="w-full border-b border-white/20 pb-3">
                <span
                  className={`block text-[32px] leading-none tracking-wide ${isVerified ? "text-white" : "text-white/30 italic"}`}
                  style={{ fontFamily: "'Georgia', 'Palatino Linotype', serif", fontStyle: "italic" }}
                >
                  {displayName}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-raleway font-medium text-[13px] text-white/50">
                  Verified Legal Name
                </span>
                {isVerified && (
                  <div className="flex items-center gap-1.5 bg-primary-green/10 border border-primary-green/30 rounded-full px-3 py-1">
                    <FiCheck className="text-primary-green" size={11} strokeWidth={3} />
                    <span className="font-raleway font-medium text-[11px] text-primary-green">Verified</span>
                  </div>
                )}
              </div>
            </div>

            <span className="font-raleway font-normal text-[12px] text-white/40 leading-4.5">
              By signing, your verified legal name above will be permanently recorded on this agreement.
            </span>
          </div>

          {/* ── Consent checkbox + Sign button ─────────────────── */}
          <div className="flex flex-col gap-4">
            <label className="flex items-start gap-3 cursor-pointer group w-full">
              <div
                className={`mt-0.5 w-4.5 h-4.5 shrink-0 rounded-full flex items-center justify-center transition-colors border ${
                  isChecked
                    ? "bg-primary-green border-primary-green"
                    : "bg-white/10 border-transparent group-hover:border-white/30"
                }`}
              >
                {isChecked && <FiCheck className="text-white" size={12} strokeWidth={3} />}
              </div>
              <span className="font-raleway font-normal text-[14px] text-white/80 leading-5.25 select-none">
                I confirm that I have read and reviewed this agreement in full and agree to its terms.
              </span>
              <input
                type="checkbox"
                className="hidden"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
              />
            </label>

            <Button
              onClick={handleSign}
              disabled={!isChecked || isPending || !isVerified}
              className={`w-full h-14 rounded-full font-raleway font-semibold text-[16px] leading-6 text-white transition-all duration-300 ${
                !isChecked || !isVerified
                  ? "bg-primary-green/10 text-white/40 cursor-not-allowed border-none"
                  : "bg-primary-green hover:bg-accent-green-success shadow-[0_4px_20px_rgba(115,191,68,0.4)]"
              }`}
            >
              {isPending ? "Signing..." : "Sign Agreement"}
            </Button>

            {!isVerified && (
              <p className="text-center font-raleway text-[12px] text-accent-yellow/80">
                Identity verification required before you can sign.
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
