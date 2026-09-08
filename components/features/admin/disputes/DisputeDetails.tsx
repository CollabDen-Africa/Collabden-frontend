"use client";

import React, { useState } from "react";
import { HiOutlineFlag, HiOutlinePencil } from "react-icons/hi";
import { useDispute } from "@/hooks/admin/useDispute";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Tabs } from "@/components/ui/Tabs";
import { DisputeOverview } from "./DisputeOverview";
import { DisputeNotes } from "./DisputeNotes";
import { DisputeAudit } from "./DisputeAudit";
import { DisputeResolution } from "./DisputeResolution";
import { RecordDecision } from "./RecordDecision";
import {
  DISPUTE_TYPE_LABELS,
  DISPUTE_TYPE_COLORS,
  DISPUTE_STATUS_LABELS,
  DISPUTE_STATUS_COLORS,
  DISPUTE_STATUS_DOT,
} from "@/constants/disputes";

// ─── Constants ────────────────────────────────────────────────────────────────

interface DisputeDetailsProps {
  id: string;
}

export const DisputeDetails: React.FC<DisputeDetailsProps> = ({ id }) => {
  const { data: dispute, isLoading, isError } = useDispute(id);
  const [activeTab, setActiveTab] = useState("Dispute Details");
  const [isRecordingDecision, setIsRecordingDecision] = useState(false);

  if (isLoading) {
    return <div className="p-8 text-white/40 text-center">Loading dispute details...</div>;
  }
  if (isError || !dispute) {
    return <div className="p-8 text-red-500 text-center">Error loading dispute.</div>;
  }

  const submittedDate = new Date(dispute.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="w-full flex flex-col gap-6 pb-12 text-white">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Admin Portal" },
          { label: "Disputes", href: "/admin/disputes" },
          { 
            label: isRecordingDecision ? dispute.disputeCode : `${dispute.disputeCode} — ${dispute.project || "Platform Activity"}`, 
            ...(isRecordingDecision ? { href: "#" } : {}) 
          },
          ...(isRecordingDecision ? [{ label: "Record Decision" }] : []),
        ]}
      />

      {isRecordingDecision ? (
        <RecordDecision dispute={dispute as any} onCancel={() => setIsRecordingDecision(false)} />
      ) : (
        <div className="w-full bg-[#121415] border border-white/5 rounded-2xl overflow-hidden flex flex-col">
        {/* Header Section */}
        <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="w-20 h-20 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
              <HiOutlineFlag size={32} />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                {dispute.disputeCode} — {DISPUTE_TYPE_LABELS[dispute.type]}
              </h1>
              
              {/* Type Badge */}
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${DISPUTE_TYPE_COLORS[dispute.type]}`}>
                {DISPUTE_TYPE_LABELS[dispute.type]}
              </span>
              
              {/* Status Badge */}
              <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border border-white/5 bg-white/2 ${DISPUTE_STATUS_COLORS[dispute.status]}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${DISPUTE_STATUS_DOT[dispute.status]}`} />
                {DISPUTE_STATUS_LABELS[dispute.status]}
              </span>
              </div>

              <div className="text-sm text-white/40 flex flex-wrap items-center gap-2">
                <span>{dispute.disputeCode} · Ref: {dispute.reference}</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span>Submitted {submittedDate}</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span>Assigned to: <strong className="text-white font-medium">{dispute.assignedAdmin || "Unassigned"}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={() => setIsRecordingDecision(true)}
              className="px-5 py-2.5 rounded-xl bg-primary-green hover:bg-[#84d653] text-[#0d0f10] text-sm font-bold transition-colors flex items-center justify-center gap-2"
            >
              <HiOutlinePencil size={18} />
              Record Decision
            </button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          tabs={["Dispute Details", "Investigation Notes", "Resolution", "Audit History"]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Tab Content */}
        {activeTab === "Dispute Details" && <DisputeOverview dispute={dispute} />}
        {activeTab === "Investigation Notes" && (
          <DisputeNotes disputeId={id} notes={dispute.notes} />
        )}
        {activeTab === "Resolution" && (
          <DisputeResolution dispute={dispute as any} />
        )}
        {activeTab === "Audit History" && (
          <DisputeAudit dispute={dispute} />
        )}
      </div>
      )}
    </div>
  );
};
