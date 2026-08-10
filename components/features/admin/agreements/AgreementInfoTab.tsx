"use client";

import React from "react";
import { HiCheckCircle, HiOutlineClock, HiOutlineDocumentText, HiOutlineExclamationCircle, HiOutlineLockClosed } from "react-icons/hi";
import Link from "next/link";

export interface SignatoryUser {
  id: string;
  name: string;
  role: string;
  status: "Signed" | "Pending";
  signedDate?: string;
}

export interface DisputeInfo {
  filedBy: string;
  date: string;
  reason: string;
}

export interface AgreementInfoData {
  agreementId: string;
  projectName: string;
  projectId: string;
  status: string;
  dateCreated: string;
  dateSigned: string;
  agreementType: string;
  format: string;
  displayFile: string;
  fileSize: string;
  ownerId: string;
  ownerName: string;
  ownerRole: string;
  signatories: SignatoryUser[];
  dispute?: DisputeInfo;
  tamperProofHash?: string;
}

interface AgreementInfoTabProps {
  data: AgreementInfoData;
}

export const AgreementInfoTab: React.FC<AgreementInfoTabProps> = ({ data }) => {
  return (
    <div className="p-6 md:p-8 flex flex-col gap-8 animate-in fade-in duration-300">
      {/* Red Alert Callout Box if Under Dispute */}
      {data.dispute && (
        <div className="p-5 rounded-2xl bg-accent-soft-red/20 border border-accent-red/40 flex items-start gap-4 shadow-lg">
          <HiOutlineExclamationCircle size={24} className="text-accent-red shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <h4 className="text-sm font-bold text-accent-red uppercase tracking-wider">
              Agreement Under Dispute
            </h4>
            <p className="text-xs text-white/80 leading-relaxed font-sans">
              A dispute was filed on <strong>{data.dispute.date}</strong> by <strong>{data.dispute.filedBy}</strong>. Reason: <em>&ldquo;{data.dispute.reason}&rdquo;</em>. Review the activity history and user communications surrounding this agreement.
            </p>
          </div>
        </div>
      )}

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Agreement Information & Project Owner */}
        <div className="flex flex-col gap-6">
          {/* Card 1: AGREEMENT INFORMATION */}
          <div className="bg-card-bg-alt/30 border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted border-b border-white/5 pb-3">
              Agreement Information
            </h3>

            <div className="flex flex-col gap-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-text-muted font-medium">Agreement ID</span>
                <span className="font-mono text-white/80">{data.agreementId}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-text-muted font-medium">Associated Project</span>
                <Link
                  href={`/admin/projects/${data.projectId}`}
                  className="text-white font-semibold hover:text-primary-green transition-colors"
                >
                  {data.projectName}
                </Link>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-text-muted font-medium">Agreement Status</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    data.status === "Disputed"
                      ? "bg-accent-soft-red text-accent-red border border-accent-red/30"
                      : "bg-accent-soft-green text-accent-green-success border border-accent-green-success/30"
                  }`}
                >
                  {data.status}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-text-muted font-medium">Date Created</span>
                <span className="text-white/80">{data.dateCreated}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-text-muted font-medium">Date Signed</span>
                <span className="text-white/80">{data.dateSigned}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-text-muted font-medium">Document Type</span>
                <span className="text-white font-semibold">{data.agreementType}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-text-muted font-medium">Format</span>
                <span className="text-white/80">{data.format}</span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-text-muted font-medium">Display File</span>
                <span className="font-mono text-primary-green font-semibold">{data.displayFile}</span>
              </div>
            </div>
          </div>

          {/* Card 2: PROJECT OWNER */}
          <div className="bg-card-bg-alt/30 border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted border-b border-white/5 pb-3">
              Project Owner
            </h3>

            <div className="flex items-center gap-4 p-3.5 rounded-xl bg-white/2 border border-white/5">
              <div className="w-12 h-12 rounded-full bg-card-bg border border-primary-green flex items-center justify-center text-white font-bold text-sm uppercase shrink-0">
                {data.ownerName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white">{data.ownerName}</span>
                <span className="text-xs text-text-muted">{data.ownerRole}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Signature Status & Signed Document Copy */}
        <div className="flex flex-col gap-6">
          {/* Card 3: SIGNATURE STATUS */}
          <div className="bg-card-bg-alt/30 border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted border-b border-white/5 pb-3">
              Signature Status
            </h3>

            <div className="flex flex-col gap-3">
              {data.signatories.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-white/2 border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-card-bg border border-white/10 flex items-center justify-center text-white font-bold text-xs uppercase shrink-0">
                      {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white">{user.name}</span>
                      <span className="text-[10px] text-text-muted">{user.role}</span>
                    </div>
                  </div>

                  {user.status === "Signed" ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-accent-soft-green text-accent-green-success border border-accent-green-success/30">
                      <HiCheckCircle size={14} /> Signed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary-blue/20 text-secondary-blue border border-primary-blue/30">
                      <HiOutlineClock size={14} /> Pending
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Signed Agreement Copy Box */}
          <div className="bg-card-bg-alt/30 border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary-green">
              <HiOutlineDocumentText size={32} />
            </div>

            <div className="flex flex-col gap-1">
              <h4 className="text-sm font-bold text-white">Signed Agreement Copy</h4>
              <span className="text-xs text-text-muted">
                {data.displayFile} ({data.fileSize})
              </span>
              <span className="text-[10px] font-mono text-white/40 flex items-center justify-center gap-1 mt-1">
                <HiOutlineLockClosed size={12} /> SHA-256 Tamper-Proof Verified
              </span>
            </div>

            <button className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary-green/15 text-primary-green hover:bg-primary-green/25 text-xs font-bold border border-primary-green/30 transition-all cursor-pointer w-full mt-2">
              View Signed Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
