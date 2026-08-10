"use client";

import React from "react";
import { HiOutlineDocumentText, HiOutlineEye, HiOutlineDownload } from "react-icons/hi";

export interface AgreementHeaderData {
  id: string;
  agreementId: string;
  title: string;
  status: "Signed" | "Pending Signatures" | "Disputed" | "Draft";
  agreementType: string;
  documentUrl?: string;
}

interface AgreementHeaderBannerProps {
  data: AgreementHeaderData;
  onViewDocument?: () => void;
  onDownload?: () => void;
}

export const AgreementHeaderBanner: React.FC<AgreementHeaderBannerProps> = ({
  data,
  onViewDocument,
  onDownload,
}) => {
  return (
    <div className="p-6 md:p-8 bg-card-bg-alt/40 border-b border-white/5 flex flex-col gap-6">
      {/* Top Banner Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Icon & Identity */}
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-card-bg border-2 border-primary-green flex items-center justify-center text-primary-green shrink-0 shadow-lg">
            <HiOutlineDocumentText size={30} />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold text-white tracking-tight font-sans">
                {data.title}
              </h2>
              {data.status === "Disputed" && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent-soft-red text-accent-red border border-accent-red/30">
                  Disputed
                </span>
              )}
              {data.status === "Signed" && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent-soft-green text-accent-green-success border border-accent-green-success/30">
                  Signed
                </span>
              )}
              {data.status === "Pending Signatures" && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-blue/20 text-secondary-blue border border-primary-blue/30">
                  Pending Signatures
                </span>
              )}
            </div>

            {/* Sub Meta Row */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted">
              <span className="font-mono text-white/70">{data.agreementId}</span>
              <span>•</span>
              <span className="text-white/80">{data.agreementType}</span>
            </div>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onViewDocument}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-green text-text-main text-xs font-bold hover:brightness-110 transition-all cursor-pointer"
          >
            <HiOutlineEye size={16} />
            View Document
          </button>
          <button
            onClick={onDownload}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-all cursor-pointer"
          >
            <HiOutlineDownload size={16} />
            Download
          </button>
        </div>
      </div>
    </div>
  );
};
