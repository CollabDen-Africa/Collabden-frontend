"use client";

import React from "react";
import { Table, Column } from "@/components/ui/Table";
import EmptyState from "@/components/ui/EmptyState";
import { HiOutlineUserGroup } from "react-icons/hi";
import Link from "next/link";

export interface ApplicantActivityItem {
  id: string;
  name: string;
  role: string;
  rating: number;
  status: "Shortlisted" | "Applied" | "Rejected";
  appliedDate: string;
}

export interface PostingDetailsData {
  postId: string;
  genre: string;
  requiredRole: string;
  scope: string;
  isRemote: boolean;
  applicationsReceived: number;
  fixedBudget: string;
  ownerId: string;
  ownerName: string;
  ownerRole: string;
  ownerEmail?: string;
  applicants: ApplicantActivityItem[];
}

interface MarketplacePostingInfoTabProps {
  data: PostingDetailsData;
}

const StatusBadge: React.FC<{ status: ApplicantActivityItem["status"] }> = ({ status }) => {
  const badgeStyles: Record<ApplicantActivityItem["status"], string> = {
    Shortlisted: "bg-accent-soft-green text-accent-green-success border border-accent-green-success/20",
    Applied: "bg-primary-blue/20 text-secondary-blue border border-primary-blue/30",
    Rejected: "bg-accent-soft-red text-accent-red border border-accent-red/20",
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badgeStyles[status] || badgeStyles.Applied}`}>
      {status}
    </span>
  );
};

export const MarketplacePostingInfoTab: React.FC<MarketplacePostingInfoTabProps> = ({ data }) => {
  const columns: Column<ApplicantActivityItem>[] = [
    {
      key: "name",
      label: "APPLICANT",
      render: (row: ApplicantActivityItem) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-card-bg flex items-center justify-center text-white font-bold text-xs uppercase border border-white/10 shrink-0">
            {row.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-white">{row.name}</span>
            <span className="text-[10px] text-text-muted">{row.role}</span>
          </div>
        </div>
      ),
    },
    {
      key: "rating",
      label: "RATING",
      render: (row: ApplicantActivityItem) => (
        <span className="text-xs font-bold text-accent-yellow">★ {row.rating.toFixed(1)}</span>
      ),
    },
    {
      key: "status",
      label: "STATUS",
      render: (row: ApplicantActivityItem) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
      {/* Left Column: Posting Details & Posted By */}
      <div className="flex flex-col gap-6">
        {/* Card 1: POSTING DETAILS */}
        <div className="bg-card-bg-alt/30 border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted border-b border-white/5 pb-3">
            Posting Details
          </h3>

          <div className="flex flex-col gap-3 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-white/5">
              <span className="text-text-muted font-medium">Post ID</span>
              <span className="font-mono text-white/80">{data.postId}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-white/5">
              <span className="text-text-muted font-medium">Genre</span>
              <span className="text-white font-semibold">{data.genre}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-white/5">
              <span className="text-text-muted font-medium">Required Role</span>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-primary-blue/20 text-secondary-blue border border-primary-blue/30">
                {data.requiredRole}
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-white/5">
              <span className="text-text-muted font-medium">Scope</span>
              <span className="text-white/80">{data.scope}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-white/5">
              <span className="text-text-muted font-medium">Remote</span>
              <span className="text-white font-semibold">{data.isRemote ? "Yes" : "No"}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-white/5">
              <span className="text-text-muted font-medium">Applications</span>
              <span className="text-primary-green font-bold">{data.applicationsReceived} received</span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-text-muted font-medium">Fixed Budget</span>
              <span className="text-white font-bold text-sm">{data.fixedBudget}</span>
            </div>
          </div>
        </div>

        {/* Card 2: POSTED BY */}
        <div className="bg-card-bg-alt/30 border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted border-b border-white/5 pb-3">
            Posted By
          </h3>

          <Link
            href={`/admin/marketplace/${data.ownerId}`}
            className="flex items-center gap-4 p-3 rounded-xl bg-white/2 hover:bg-white/5 border border-white/5 transition-colors group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-card-bg border border-primary-green flex items-center justify-center text-white font-bold text-sm uppercase shrink-0">
              {data.ownerName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white group-hover:text-primary-green transition-colors">
                {data.ownerName}
              </span>
              <span className="text-xs text-text-muted">{data.ownerRole}</span>
              {data.ownerEmail && <span className="text-[11px] text-white/40">{data.ownerEmail}</span>}
            </div>
          </Link>
        </div>
      </div>

      {/* Right Column: Application Activity Table */}
      <div className="bg-card-bg-alt/30 border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted border-b border-white/5 pb-3">
          Application Activity ({data.applicants.length})
        </h3>
        <Table
          columns={columns}
          data={data.applicants}
          emptyState={
            <div className="py-6 px-4">
              <EmptyState
                icon={<HiOutlineUserGroup size={36} />}
                title="No Applications Received"
                description="No applicant responses or applications have been submitted for this posting yet."
              />
            </div>
          }
        />
      </div>
    </div>
  );
};
