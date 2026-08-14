"use client";

import React, { useState } from "react";
import { HiOutlineUserAdd, HiOutlineChatAlt, HiOutlineRefresh, HiCheckCircle } from "react-icons/hi";
import { HiOutlinePaperAirplane, HiOutlinePaperClip } from "react-icons/hi2";
import { SectionCard } from "@/components/ui/SectionCard";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import { type DisputeDetail } from "@/services/admin/disputes.service";

interface DisputeResolutionProps {
  dispute: DisputeDetail;
}

export const DisputeResolution: React.FC<DisputeResolutionProps> = ({ dispute }) => {
  const [selectedParty, setSelectedParty] = useState<"complainant" | "respondent" | "both">("both");
  const [selectedStatus, setSelectedStatus] = useState(dispute.status);

  const STATUS_OPTIONS = [
    { value: "OPEN", label: "Open" },
    { value: "UNDER_REVIEW", label: "Under Review" },
    { value: "AWAITING_RESPONSE", label: "Awaiting Response" },
    { value: "RESOLVED", label: "Resolved" },
    { value: "CLOSED", label: "Closed" },
  ];

  return (
    <div className="p-6 md:p-8 bg-[#0a0a0c] flex flex-col md:flex-row gap-6 text-white">
      {/* Left Column */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Assignment Section */}
        <SectionCard icon={<HiOutlineUserAdd size={20} className="text-[#72c043]" />} title="Assignment">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-white/40 font-medium">Currently Assigned To</label>
            <div className="bg-white/5 border border-[#72c043]/30 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1c2936] flex items-center justify-center text-blue-400 font-bold text-sm">
                  {dispute.assignedAdmin ? dispute.assignedAdmin.substring(0, 2).toUpperCase() : "UN"}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-white">{dispute.assignedAdmin || "Unassigned"}</span>
                  <span className="text-xs text-[#72c043]">Assigned Jul 8, 2025</span>
                </div>
              </div>
              <HiCheckCircle size={20} className="text-[#72c043]" />
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <label className="text-sm text-white/40 font-medium">Reassign To</label>
            <select className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-white/20 appearance-none">
              <option value="">Select administrator..</option>
              <option value="admin1">Admin 1</option>
              <option value="admin2">Admin 2</option>
            </select>
            <button className="w-full mt-2 px-5 py-3 rounded-xl border border-white/10 bg-transparent hover:bg-white/5 text-white/60 text-sm font-medium transition-colors flex items-center justify-center gap-2">
              <HiOutlineUserAdd size={18} />
              Reassign Dispute
            </button>
          </div>
        </SectionCard>

        {/* Message Parties Section */}
        <SectionCard icon={<HiOutlineChatAlt size={20} className="text-blue-400" />} title="Message Parties">
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedParty("complainant")}
              className={`flex-1 py-3 px-4 rounded-xl border text-xs sm:text-sm font-medium transition-colors flex flex-col items-center justify-center min-w-[120px] ${
                selectedParty === "complainant"
                  ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                  : "bg-transparent border-white/10 text-white/40 hover:bg-white/5"
              }`}
            >
              <span className="text-white">{dispute.complainant.name}</span>
              <span className="text-[10px] sm:text-xs opacity-70">(Complainant)</span>
            </button>
            <button
              onClick={() => setSelectedParty("respondent")}
              className={`flex-1 py-3 px-4 rounded-xl border text-xs sm:text-sm font-medium transition-colors flex flex-col items-center justify-center min-w-[120px] ${
                selectedParty === "respondent"
                  ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                  : "bg-transparent border-white/10 text-white/40 hover:bg-white/5"
              }`}
            >
              <span className="text-white">{dispute.respondent.name}</span>
              <span className="text-[10px] sm:text-xs opacity-70">(Respondent)</span>
            </button>
            <button
              onClick={() => setSelectedParty("both")}
              className={`py-3 px-4 rounded-xl border text-xs sm:text-sm font-medium transition-colors flex items-center justify-center min-w-[80px] h-full ${
                selectedParty === "both"
                  ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                  : "bg-transparent border-white/10 text-white/40 hover:bg-white/5"
              }`}
            >
              Both<br/>Parties
            </button>
          </div>

          <textarea
            placeholder="We are reviewing the evidence submitted and require additional clarification regarding the agreed payment amount. Please provide.."
            className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/20 resize-none"
          ></textarea>

          <Button
            variant="primary"
            size="sm"
            icon={HiOutlinePaperAirplane}
            iconPosition="left"
            className="w-full py-3 rounded-xl"
          >
            Send Message
          </Button>
        </SectionCard>
      </div>

      {/* Right Column */}
      <div className="flex-1 flex flex-col">
        <SectionCard
          icon={<HiOutlineRefresh size={20} className="text-yellow-400" />}
          title="Update Status"
          className="h-full"
        >
          <div className="flex flex-col gap-2">
            <label className="text-sm text-white/40 font-medium mb-1">Current Status</label>
            <div className="flex flex-col gap-3">
              {STATUS_OPTIONS.map((option) => {
                const isSelected = selectedStatus === option.value;
                const isCurrent = dispute.status === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => setSelectedStatus(option.value as any)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-colors ${
                      isSelected
                        ? "bg-yellow-400/5 border-yellow-400/30"
                        : "bg-transparent border-white/5 hover:border-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? "border-yellow-400" : "border-white/20"
                      }`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-yellow-400" />}
                      </div>
                      <span className={`text-sm font-medium ${isSelected ? "text-yellow-400" : "text-white/60"}`}>
                        {option.label}
                      </span>
                    </div>
                    {isCurrent && (
                      <span className="text-xs font-medium text-yellow-400/80">Current</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-auto pt-4">
            <label className="text-sm text-white/40 font-medium">Reason for Status Change</label>
            <textarea
              placeholder="Evidence request sent to both parties. Awaiting their responses.."
              className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/20 resize-none"
            ></textarea>

            <Button
              variant="primary"
              size="sm"
              icon={HiOutlineRefresh}
              iconPosition="left"
              className="w-full py-3 rounded-xl mt-2"
            >
              Update Status
            </Button>
            <p className="text-center text-xs text-white/30 mt-2">
              Users will be notified of any status change.
            </p>
          </div>
        </SectionCard>

        {/* Request Additional Evidence */}
        <SectionCard
          icon={<HiOutlinePaperClip size={20} className="text-[#72c043]" />}
          title="Request Additional Evidence"
          className="mt-6"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/5">
              <Avatar name={dispute.complainant.name} className="w-7 h-7 text-[10px]" />
              <span className="text-sm text-white/70">{dispute.complainant.name}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/5">
              <Avatar name={dispute.respondent.name} className="w-7 h-7 text-[10px]" />
              <span className="text-sm text-white/70">{dispute.respondent.name}</span>
            </div>
          </div>

          <textarea
            placeholder="Describe what evidence is required.."
            className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/20 resize-none"
          ></textarea>

          <Button
            variant="primary"
            size="sm"
            icon={HiOutlinePaperClip}
            iconPosition="left"
            className="w-full py-3 rounded-xl"
          >
            Send Evidence Request
          </Button>
        </SectionCard>
      </div>
    </div>
  );
};
