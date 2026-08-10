"use client";

import React from "react";
import { Table, Column } from "@/components/ui/Table";

export interface CollabReportItem {
  id: string;
  reportId: string;
  reason: string;
  reporterName: string;
  date: string;
  status: "Pending" | "Reviewed" | "Dismissed" | "Action Taken";
}

interface MarketplaceCollabReportsTabProps {
  reports: CollabReportItem[];
  isLoading?: boolean;
  onUpdateStatus?: (reportId: string, status: string) => void;
}

const StatusBadge: React.FC<{ status: CollabReportItem["status"] }> = ({ status }) => {
  const badgeStyles: Record<CollabReportItem["status"], string> = {
    Pending: "bg-accent-yellow/10 text-accent-yellow border border-accent-yellow/20",
    Reviewed: "bg-primary-blue/20 text-secondary-blue border border-primary-blue/30",
    Dismissed: "bg-white/10 text-white/40 border border-white/10",
    "Action Taken": "bg-accent-soft-red text-accent-red border border-accent-red/20",
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badgeStyles[status] || badgeStyles.Pending}`}>
      {status}
    </span>
  );
};

export const MarketplaceCollabReportsTab: React.FC<MarketplaceCollabReportsTabProps> = ({
  reports,
  isLoading,
  onUpdateStatus,
}) => {
  const columns: Column<CollabReportItem>[] = [
    {
      key: "reportId",
      label: "REPORT ID",
      render: (row: CollabReportItem) => (
        <span className="font-mono text-xs text-white/80">{row.reportId}</span>
      ),
    },
    {
      key: "reason",
      label: "REASON / REASON DETAILS",
      render: (row: CollabReportItem) => (
        <span className="text-xs font-medium text-white">{row.reason}</span>
      ),
    },
    {
      key: "reporterName",
      label: "REPORTER",
      render: (row: CollabReportItem) => (
        <span className="text-xs text-text-muted">{row.reporterName}</span>
      ),
    },
    {
      key: "date",
      label: "DATE",
      render: (row: CollabReportItem) => (
        <span className="text-xs text-text-muted">{row.date}</span>
      ),
    },
    {
      key: "status",
      label: "STATUS",
      render: (row: CollabReportItem) => <StatusBadge status={row.status} />,
    },
    {
      key: "actions",
      label: "ACTION",
      render: (row: CollabReportItem) => (
        <div className="flex items-center gap-2">
          {row.status === "Pending" && (
            <button
              onClick={() => onUpdateStatus?.(row.id, "Reviewed")}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-white transition-colors cursor-pointer"
            >
              Mark Reviewed
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 md:p-8 flex flex-col gap-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted">
          Reports Filed ({reports.length})
        </h3>
      </div>
      <Table columns={columns} data={reports} isLoading={isLoading} emptyState={<div className="py-8 text-center text-white/40">No reports filed for this collaborator.</div>} />
    </div>
  );
};
