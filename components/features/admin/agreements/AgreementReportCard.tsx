"use client";

import React from "react";
import { HiOutlineDocumentText, HiOutlineEye, HiOutlinePlus } from "react-icons/hi";
import Link from "next/link";

export interface UserInvolvedItem {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface AgreementReportCardItem {
  id: string;
  agreementId: string;
  agreementTitle: string;
  reportId: string;
  status: "Pending" | "Under Review" | "Resolved";
  reason: string;
  reportedBy: { id: string; name: string };
  usersInvolved: UserInvolvedItem[];
  reportedDate: string;
}

interface AgreementReportCardProps {
  item: AgreementReportCardItem;
  onAddNote: (item: AgreementReportCardItem) => void;
}

const StatusBadge: React.FC<{ status: AgreementReportCardItem["status"] }> = ({ status }) => {
  const badgeStyles: Record<AgreementReportCardItem["status"], string> = {
    Pending: "bg-accent-yellow/10 text-accent-yellow border border-accent-yellow/20",
    "Under Review": "bg-primary-blue/20 text-secondary-blue border border-primary-blue/30",
    Resolved: "bg-accent-soft-green text-accent-green-success border border-accent-green-success/20",
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${badgeStyles[status] || badgeStyles.Pending}`}>
      {status}
    </span>
  );
};

export const AgreementReportCard: React.FC<AgreementReportCardProps> = ({ item, onAddNote }) => {
  return (
    <div className="p-6 rounded-2xl bg-card-bg-alt/30 border border-white/5 flex flex-col gap-4 hover:border-white/10 transition-all">
      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-card-bg border border-primary-green flex items-center justify-center text-primary-green shrink-0">
            <HiOutlineDocumentText size={22} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-white/50">{item.agreementId}</span>
              <Link
                href={`/admin/agreements/${item.id}`}
                className="text-sm font-bold text-white hover:text-primary-green transition-colors"
              >
                {item.agreementTitle}
              </Link>
              <StatusBadge status={item.status} />
            </div>
          </div>
        </div>

        {/* Report ID & Date */}
        <div className="text-xs text-text-muted sm:text-right shrink-0">
          <span className="font-mono text-white/70">Report ID: {item.reportId}</span>
          <div className="text-[11px] text-white/40">{item.reportedDate}</div>
        </div>
      </div>

      {/* Reported Reason Box */}
      <div className="p-3.5 rounded-xl bg-white/2 border border-white/5 text-xs text-white/80 leading-relaxed font-sans">
        🚩 <strong className="text-white">Reason:</strong> {item.reason}
      </div>

      {/* Card Footer: Users Involved & Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/5">
        <div className="flex flex-wrap items-center gap-6 text-xs">
          {/* REPORTED BY */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase text-text-muted">Reported By</span>
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-card-bg border border-white/10 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                {item.reportedBy.name[0]}
              </div>
              <span className="font-semibold text-white/90">{item.reportedBy.name}</span>
            </div>
          </div>

          {/* USERS INVOLVED */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase text-text-muted">Users Involved</span>
            <div className="flex items-center -space-x-1 overflow-hidden">
              {item.usersInvolved.map((u, idx) => (
                <div
                  key={idx}
                  className="w-6 h-6 rounded-full bg-card-bg border border-white/20 flex items-center justify-center text-[9px] font-bold text-white uppercase"
                  title={u.name}
                >
                  {u.name[0]}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/agreements/${item.id}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-green text-text-main text-xs font-bold hover:brightness-110 transition-all cursor-pointer"
          >
            <HiOutlineEye size={15} />
            Review Agreement
          </Link>
          <button
            onClick={() => onAddNote(item)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-all cursor-pointer"
          >
            <HiOutlinePlus size={15} />
            Add Note
          </button>
        </div>
      </div>
    </div>
  );
};
