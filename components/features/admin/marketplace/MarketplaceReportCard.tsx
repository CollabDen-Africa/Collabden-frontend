"use client";

import React from "react";
import { HiOutlineMusicNote, HiOutlineBan, HiOutlineTrash, HiOutlinePlus, HiOutlineEye } from "react-icons/hi";
import Link from "next/link";

export interface MarketplaceReportCardItem {
  id: string;
  targetId: string;
  targetName: string;
  targetType: "profile" | "posting";
  profileIdOrPostId: string;
  categoryOrRole: string;
  status: "Pending" | "Under Review" | "Resolved";
  reason: string;
  reporterName: string;
  reportedDate: string;
}

interface MarketplaceReportCardProps {
  item: MarketplaceReportCardItem;
  onModerate: (item: MarketplaceReportCardItem) => void;
  onAddNote: (item: MarketplaceReportCardItem) => void;
}

const StatusBadge: React.FC<{ status: MarketplaceReportCardItem["status"] }> = ({ status }) => {
  const badgeStyles: Record<MarketplaceReportCardItem["status"], string> = {
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

export const MarketplaceReportCard: React.FC<MarketplaceReportCardProps> = ({
  item,
  onModerate,
  onAddNote,
}) => {
  const targetLink =
    item.targetType === "profile"
      ? `/admin/marketplace/${item.targetId}`
      : `/admin/marketplace/postings/${item.targetId}`;

  return (
    <div className="p-6 rounded-2xl bg-card-bg-alt/30 border border-white/5 flex flex-col gap-4 hover:border-white/10 transition-all">
      {/* Top Identity & Status Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {item.targetType === "profile" ? (
            <div className="w-11 h-11 rounded-full bg-card-bg border border-white/10 flex items-center justify-center text-white font-bold text-xs uppercase shrink-0">
              {item.targetName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
          ) : (
            <div className="w-11 h-11 rounded-2xl bg-card-bg border border-primary-blue flex items-center justify-center text-secondary-blue shrink-0">
              <HiOutlineMusicNote size={20} />
            </div>
          )}
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <Link href={targetLink} className="text-sm font-bold text-white hover:text-primary-green transition-colors">
                {item.targetName}
              </Link>
              <span className="font-mono text-xs text-white/50">{item.profileIdOrPostId}</span>
              <StatusBadge status={item.status} />
            </div>
            <span className="text-xs text-text-muted mt-0.5">{item.categoryOrRole}</span>
          </div>
        </div>

        {/* Reporter Info */}
        <div className="text-xs text-text-muted sm:text-right shrink-0">
          <span>Reported by <strong className="text-white">{item.reporterName}</strong></span>
          <div className="text-[11px] text-white/40">{item.reportedDate}</div>
        </div>
      </div>

      {/* Reported Reason Box */}
      <div className="p-3.5 rounded-xl bg-white/2 border border-white/5 text-xs text-white/80 leading-relaxed font-sans">
        🚨 <strong className="text-white">Reason:</strong> {item.reason}
      </div>

      {/* Quick Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5">
        <Link
          href={targetLink}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-all cursor-pointer"
        >
          <HiOutlineEye size={14} />
          {item.targetType === "profile" ? "Review Profile" : "Review Posting"}
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onModerate(item)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent-yellow/10 hover:bg-accent-yellow/20 text-accent-yellow text-xs font-semibold border border-accent-yellow/30 transition-all cursor-pointer"
          >
            <HiOutlineBan size={14} />
            Restrict
          </button>
          <button
            onClick={() => onModerate(item)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent-soft-red/20 hover:bg-accent-soft-red/40 text-accent-red text-xs font-semibold border border-accent-red/30 transition-all cursor-pointer"
          >
            <HiOutlineTrash size={14} />
            Remove
          </button>
          <button
            onClick={() => onAddNote(item)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-all cursor-pointer"
          >
            <HiOutlinePlus size={14} />
            Add Note
          </button>
        </div>
      </div>
    </div>
  );
};
