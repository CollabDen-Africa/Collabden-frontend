"use client";

import React from "react";
import { HiOutlineEye, HiOutlineChatAlt } from "react-icons/hi";
import { HiOutlineArrowTopRightOnSquare } from "react-icons/hi2";
import { InfoCard, InfoRow } from "@/components/features/admin/users/UserOverview";
import Avatar from "@/components/ui/Avatar";
import type { DisputeDetail, DisputeType, DisputeStatus } from "@/services/admin/disputes.service";

// ─── Label maps ───────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<DisputeType, string> = {
  PAYMENT: "Payment",
  ESCROW_MILESTONE: "Escrow Milestone",
  AGREEMENT: "Agreement",
  PROJECT_COLLABORATION: "Project Collaboration",
  USER_CONDUCT: "User Conduct",
};

const STATUS_LABELS: Record<DisputeStatus, string> = {
  OPEN: "Open",
  UNDER_REVIEW: "Under Review",
  AWAITING_RESPONSE: "Awaiting Response",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

const STATUS_COLORS: Record<DisputeStatus, string> = {
  OPEN: "text-red-400",
  UNDER_REVIEW: "text-yellow-400",
  AWAITING_RESPONSE: "text-blue-400",
  RESOLVED: "text-emerald-400",
  CLOSED: "text-white/40",
};

const TYPE_COLORS: Record<DisputeType, string> = {
  PAYMENT: "text-blue-400",
  ESCROW_MILESTONE: "text-purple-400",
  AGREEMENT: "text-teal-400",
  PROJECT_COLLABORATION: "text-indigo-400",
  USER_CONDUCT: "text-red-400",
};

// ─── Component ────────────────────────────────────────────────────────────────

interface DisputeOverviewProps {
  dispute: DisputeDetail;
}

export const DisputeOverview: React.FC<DisputeOverviewProps> = ({ dispute }) => {
  const dateStr = new Date(dispute.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6 bg-[#0a0a0c]">
      {/* Left Column */}
      <div className="flex flex-col gap-6">
        {/* Dispute Information */}
        <InfoCard title="Dispute Information">
          <InfoRow label="Dispute ID" value={dispute.disputeCode} />
          <InfoRow
            label="Type"
            value={TYPE_LABELS[dispute.type]}
            valueClassName={`font-medium ${TYPE_COLORS[dispute.type]}`}
          />
          <InfoRow
            label="Status"
            value={STATUS_LABELS[dispute.status]}
            valueClassName={`font-medium ${STATUS_COLORS[dispute.status]}`}
          />
          <InfoRow label="Reference" value={
            <span className="text-[#72c043] font-mono font-medium">{dispute.reference}</span>
          } />
          {dispute.amount && (
            <InfoRow label="Amount" value={dispute.amount} />
          )}
          <InfoRow label="Date Submitted" value={dateStr} />
          <InfoRow
            label="Assigned To"
            value={dispute.assignedAdmin || "Unassigned"}
            valueClassName={dispute.assignedAdmin ? "text-[#72c043] font-medium" : "text-white/30 font-medium"}
          />
        </InfoCard>

        {/* Parties Involved */}
        <InfoCard title="Parties Involved">
          <div className="flex flex-col gap-4">
            {/* Complainant */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar name={dispute.complainant.name} className="w-10 h-10 text-sm" />
                <div className="flex flex-col">
                  <span className="text-sm text-white font-semibold">{dispute.complainant.name}</span>
                  <span className="text-xs text-white/40">Complainant</span>
                </div>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 text-xs font-medium transition-colors">
                <HiOutlineChatAlt size={14} />
                Message
              </button>
            </div>

            {/* Respondent */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar name={dispute.respondent.name} className="w-10 h-10 text-sm" />
                <div className="flex flex-col">
                  <span className="text-sm text-white font-semibold flex items-center gap-1.5">
                    {dispute.respondent.name}
                    {dispute.respondent.name === "Platform" && (
                      <span className="text-yellow-400 text-xs">★</span>
                    )}
                  </span>
                  <span className="text-xs text-white/40">Respondent</span>
                </div>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 text-xs font-medium transition-colors">
                <HiOutlineChatAlt size={14} />
                Message
              </button>
            </div>
          </div>
        </InfoCard>

        {/* Dispute Reason */}
        <InfoCard title="Dispute Reason">
          <p className="text-sm text-white/70 leading-relaxed">{dispute.reason}</p>
        </InfoCard>
      </div>

      {/* Right Column */}
      <div className="flex flex-col gap-6">
        {/* Related Records */}
        <InfoCard title="Related Records">
          <div className="flex flex-col gap-3">
            {dispute.relatedRecords.map((rec, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${rec.color} shrink-0`} />
                  <div className="flex flex-col">
                    <span className="text-sm text-white font-medium">{rec.label}</span>
                    <span className="text-xs text-white/30">{rec.reference}</span>
                  </div>
                </div>
                <button className="flex items-center gap-1 text-[#72c043] text-xs font-medium hover:text-[#84d653] transition-colors">
                  View <HiOutlineArrowTopRightOnSquare size={12} />
                </button>
              </div>
            ))}
          </div>
        </InfoCard>

        {/* Supporting Evidence */}
        <InfoCard title="Supporting Evidence">
          <div className="flex items-center justify-between mb-2">
            <span className="sr-only">Evidence files</span>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#72c043] hover:bg-[#84d653] text-[#0d0f10] text-xs font-bold transition-colors ml-auto">
              Request More
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {dispute.evidence.map((ev) => (
              <div key={ev.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name={ev.submittedBy} className="w-8 h-8 text-xs" />
                  <div className="flex flex-col">
                    <span className="text-sm text-white font-medium">{ev.filename}</span>
                    <span className="text-xs text-white/30">{ev.type} · Submitted by {ev.submittedBy}</span>
                  </div>
                </div>
                <button className="text-white/30 hover:text-white/60 transition-colors p-1">
                  <HiOutlineEye size={16} />
                </button>
              </div>
            ))}
          </div>
        </InfoCard>
      </div>
    </div>
  );
};
