"use client";

import React, { useState } from "react";
import { HiOutlinePencil, HiCheckCircle, HiOutlineLockClosed, HiOutlineCalendar, HiOutlineFlag } from "react-icons/hi";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Toggle from "@/components/ui/Toggle";
import { SectionCard } from "@/components/ui/SectionCard";
import { type DisputeDetail } from "@/services/admin/disputes.service";

interface RecordDecisionProps {
  dispute: DisputeDetail;
  onCancel: () => void;
}

export const RecordDecision: React.FC<RecordDecisionProps> = ({ dispute, onCancel }) => {
  const [outcome, setOutcome] = useState<"complainant" | "respondent" | "mutual">("complainant");
  const [notifyParties, setNotifyParties] = useState(true);

  return (
    <div className="w-full flex flex-col gap-6 text-white pb-12">
      {/* Mini Header Card */}
      <div className="bg-[#121415] border border-white/5 rounded-2xl p-6 flex items-center gap-5">
        <div className="w-16 h-16 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
          <HiOutlineFlag size={24} />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight">
              {dispute.disputeCode} — Payment Dispute · {dispute.project || "Platform Activity"}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold border border-yellow-500/20 bg-yellow-500/10 text-yellow-400">
              Under Review
            </span>
          </div>
          <div className="text-sm text-white/40 flex flex-wrap items-center gap-2">
            <span>{dispute.complainant.name} vs {dispute.respondent.name}</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>{dispute.amount || "₦30,000"}</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>Ref: {dispute.reference}</span>
          </div>
        </div>
      </div>

      {/* Main Form Card */}
      <SectionCard
        icon={
          <div className="w-12 h-12 rounded-xl bg-primary-green/10 flex items-center justify-center text-primary-green">
            <HiOutlinePencil size={24} />
          </div>
        }
        title="Record Dispute Decision"
        subtitle="This decision will be stored as a read-only record once finalized."
        className="overflow-hidden gap-0"
      >
        <div className="flex flex-col gap-8">
          
          {/* Dispute Outcome */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-bold">Dispute Outcome <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => setOutcome("complainant")}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-3 transition-colors ${
                  outcome === "complainant" ? "bg-primary-green/5 border-primary-green/30" : "bg-transparent border-white/5 hover:border-white/10"
                }`}
              >
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                  outcome === "complainant" ? "border-primary-green text-primary-green" : "border-white/20 text-white/20"
                }`}>
                  <HiCheckCircle size={20} />
                </div>
                <span className={`text-sm font-medium text-center ${outcome === "complainant" ? "text-primary-green" : "text-white/60"}`}>
                  Ruled in favour of<br/>Complainant
                </span>
              </button>
              
              <button
                onClick={() => setOutcome("respondent")}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-3 transition-colors ${
                  outcome === "respondent" ? "bg-blue-500/5 border-blue-500/30" : "bg-transparent border-white/5 hover:border-white/10"
                }`}
              >
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                  outcome === "respondent" ? "border-blue-400 text-blue-400" : "border-white/20 text-white/20"
                }`}>
                  <div className={`w-5 h-5 rounded-full ${outcome === "respondent" ? "bg-blue-400" : "bg-white/20"}`} />
                </div>
                <span className={`text-sm font-medium text-center ${outcome === "respondent" ? "text-blue-400" : "text-white/60"}`}>
                  Ruled in favour of<br/>Respondent
                </span>
              </button>

              <button
                onClick={() => setOutcome("mutual")}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-3 transition-colors ${
                  outcome === "mutual" ? "bg-yellow-500/5 border-yellow-500/30" : "bg-transparent border-white/5 hover:border-white/10"
                }`}
              >
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                  outcome === "mutual" ? "border-yellow-400 text-yellow-400" : "border-white/20 text-white/20"
                }`}>
                  <div className={`w-5 h-5 rounded-full ${outcome === "mutual" ? "bg-yellow-400" : "bg-white/20"}`} />
                </div>
                <span className={`text-sm font-medium text-center ${outcome === "mutual" ? "text-yellow-400" : "text-white/60"}`}>
                  Mutual Resolution
                </span>
              </button>
            </div>
          </div>

          {/* Resolution Summary */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold">Resolution Summary <span className="text-red-500">*</span></label>
            <textarea
              defaultValue="After reviewing the payment record TXN-18901, escrow details, and chat evidence submitted by both parties, the dispute is ruled in favour of Marcus Lee. The agreed collaboration fee per the signed agreement AGR-0215 was ₦45,000. Tolu Adeyemi is required to remit the outstanding ₦15,000 within 7 days."
              className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white/80 placeholder-white/30 focus:outline-none focus:border-white/20 resize-none leading-relaxed"
            ></textarea>
          </div>

          {/* Supporting Notes */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold">Supporting Notes</label>
            <textarea
              defaultValue="Reference chat screenshot submitted by complainant as key evidence. Both parties notified of outcome."
              className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white/80 placeholder-white/30 focus:outline-none focus:border-white/20 resize-none leading-relaxed"
            ></textarea>
          </div>

          {/* Meta Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-white/40">Date Resolved</label>
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-4">
                <HiOutlineCalendar size={20} className="text-white/40" />
                <span className="text-sm font-medium">Jul 14, 2025</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-white/40">Administrator Responsible</label>
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3.5">
                <Avatar name={dispute.assignedAdmin || "Super Admin"} className="w-7 h-7 text-xs" />
                <span className="text-sm font-medium">{dispute.assignedAdmin || "Super Admin"}</span>
              </div>
            </div>
          </div>

          {/* Notify Parties */}
          <div className="flex items-center justify-between p-5 rounded-xl border border-white/5 bg-white/[0.02]">
            <div className="flex flex-col gap-1">
              <h4 className="text-sm font-bold">Notify Parties</h4>
              <p className="text-xs text-white/40">
                {dispute.complainant.name} and {dispute.respondent.name} will be notified via email.
              </p>
            </div>
            <Toggle active={notifyParties} onChange={() => setNotifyParties(!notifyParties)} />
          </div>

          {/* Warning */}
          <div className="flex items-start gap-4 p-5 rounded-xl border border-primary-green/20 bg-primary-green/5">
            <HiOutlineLockClosed size={20} className="text-primary-green shrink-0 mt-0.5" />
            <p className="text-sm text-primary-green/90 leading-relaxed">
              Once finalized, this decision will be stored as a <strong>read-only record</strong> and cannot be edited or deleted. Dispute status will be updated to <strong>Resolved</strong>.
            </p>
          </div>
        </div>

        {/* Card Footer */}
        <div className="-mx-6 md:-mx-8 -mb-6 md:-mb-8 mt-2 p-6 border-t border-white/5 bg-white/[0.02] flex items-center justify-end gap-4">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary">
            Finalize Decision
          </Button>
        </div>
      </SectionCard>
    </div>
  );
};
