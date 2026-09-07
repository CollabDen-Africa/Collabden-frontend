"use client";

import React from "react";
import { HiOutlineLockClosed, HiOutlineDownload } from "react-icons/hi";
import Avatar from "@/components/ui/Avatar";
import type { DisputeDetail } from "@/services/admin/disputes.service";

interface DisputeAuditProps {
  dispute: DisputeDetail;
}

export const DisputeAudit: React.FC<DisputeAuditProps> = ({ dispute }) => {
  const auditHistory = dispute.auditHistory || [];

  const getActionTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "view":
        return "bg-gray-500/20 text-gray-400 border border-gray-500/20";
      case "assign":
        return "bg-green-500/20 text-green-400 border border-green-500/20";
      case "status":
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20";
      case "note":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/20";
      case "message":
        return "bg-purple-500/20 text-purple-400 border border-purple-500/20";
      case "evidence":
        return "bg-teal-500/20 text-teal-400 border border-teal-500/20";
      case "decision":
        return "bg-green-500/20 text-green-400 border border-green-500/20";
      case "final action":
        return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20";
      default:
        return "bg-gray-500/20 text-gray-400 border border-gray-500/20";
    }
  };

  const getTimelineIconColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "view":
        return "bg-gray-500";
      case "assign":
        return "bg-[#72c043]";
      case "status":
        return "bg-yellow-500";
      case "note":
        return "bg-blue-500";
      case "message":
        return "bg-purple-500";
      case "evidence":
        return "bg-teal-500";
      case "decision":
        return "bg-[#72c043]";
      case "final action":
        return "bg-emerald-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="p-6 md:p-8 bg-[#0a0a0c] flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-white">Dispute Audit History</h2>
          <p className="text-sm text-white/40 mt-1">
            {dispute.disputeCode} — {dispute.project || "Platform Activity"} · All administrative actions in chronological order
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl border border-white/5 bg-white/[0.02] text-white/40 text-xs font-medium flex items-center gap-2">
            <HiOutlineLockClosed size={14} />
            Read-Only - Immutable
          </div>
          <button className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 text-xs font-medium transition-colors flex items-center gap-2">
            <HiOutlineDownload size={14} />
            Export Log
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { value: auditHistory.length.toString(), label: "Total Actions", color: "bg-gray-500" },
          { value: "2", label: "Admins Involved", color: "bg-[#72c043]" },
          { value: "3", label: "Status Changes", color: "bg-yellow-500" },
          { value: "6 days", label: "Opened → Resolved", color: "bg-emerald-500" },
        ].map((stat, idx) => (
          <div key={idx} className="bg-[#121415] border border-white/5 rounded-2xl p-5 flex flex-col gap-1.5">
            <span className="text-xl font-bold text-white">{stat.value}</span>
            <span className="text-xs text-white/40">{stat.label}</span>
            <div className={`mt-3 h-1 w-6 rounded-full ${stat.color}`} />
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="flex flex-col gap-4 relative">
        {/* Vertical line connecting nodes */}
        <div className="absolute left-2.5 top-5 bottom-5 w-px bg-white/10" />

        {auditHistory.map((record) => {
          const dateStr = new Date(record.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
          const timeStr = new Date(record.createdAt).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });
          const mainActionType = record.actionType[0] || "View";
          const iconColor = getTimelineIconColor(mainActionType);

          return (
            <div key={record.id} className="flex gap-4 relative">
              {/* Timeline Node */}
              <div className="relative mt-5 z-10 w-5 flex justify-center">
                <div className={`w-2 h-2 rounded-full ring-4 ring-[#0a0a0c] ${iconColor}`} />
              </div>

              {/* Event Card */}
              <div className="flex-1 bg-[#121415] border border-white/5 rounded-2xl p-5 flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-white">{record.action}</span>
                      {record.actionType.map((type) => (
                        <span key={type} className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${getActionTypeColor(type)}`}>
                          {type}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed max-w-2xl">{record.description}</p>
                  </div>
                  <span className="text-[11px] text-white/40 whitespace-nowrap shrink-0 flex items-center gap-1.5">
                    <HiOutlineLockClosed size={12} />
                    {dateStr} · {timeStr}
                  </span>
                </div>

                {/* Admin info */}
                <div className="flex items-center gap-2 mt-2 pt-3 border-t border-white/5">
                  <Avatar name={record.adminName} className="w-5 h-5 text-[10px]" />
                  <span className="text-xs font-semibold text-white">{record.adminName}</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#72c043]/10 text-[#72c043] text-[10px] font-bold">
                    {record.adminRole}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
