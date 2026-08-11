"use client";

import React from "react";
import { Table, Column } from "@/components/ui/Table";
import EmptyState from "@/components/ui/EmptyState";
import { HiOutlineClock } from "react-icons/hi";

export interface CollabHistoryItem {
  id: string;
  projectName: string;
  role: string;
  status: "Completed" | "In Progress" | "Cancelled";
  date: string;
}

interface MarketplaceCollabHistoryTabProps {
  items: CollabHistoryItem[];
  isLoading?: boolean;
}

const StatusBadge: React.FC<{ status: CollabHistoryItem["status"] }> = ({ status }) => {
  const badgeStyles: Record<CollabHistoryItem["status"], string> = {
    Completed: "bg-accent-soft-green text-accent-green-success border border-accent-green-success/20",
    "In Progress": "bg-primary-blue/20 text-secondary-blue border border-primary-blue/30",
    Cancelled: "bg-accent-soft-red text-accent-red border border-accent-red/20",
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badgeStyles[status] || badgeStyles.Completed}`}>
      {status}
    </span>
  );
};

export const MarketplaceCollabHistoryTab: React.FC<MarketplaceCollabHistoryTabProps> = ({
  items,
  isLoading,
}) => {
  const columns: Column<CollabHistoryItem>[] = [
    {
      key: "projectName",
      label: "PROJECT NAME",
      render: (row: CollabHistoryItem) => (
        <span className="text-sm font-semibold text-white">{row.projectName}</span>
      ),
    },
    {
      key: "role",
      label: "ROLE ASSUMED",
      render: (row: CollabHistoryItem) => (
        <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-primary-blue/20 text-secondary-blue border border-primary-blue/30">
          {row.role}
        </span>
      ),
    },
    {
      key: "status",
      label: "STATUS",
      render: (row: CollabHistoryItem) => <StatusBadge status={row.status} />,
    },
    {
      key: "date",
      label: "DATE",
      render: (row: CollabHistoryItem) => (
        <span className="text-xs text-text-muted">{row.date}</span>
      ),
    },
  ];

  return (
    <div className="p-6 md:p-8 flex flex-col gap-4 animate-in fade-in duration-300">
      <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted">
        Collaboration History
      </h3>
      <Table
        columns={columns}
        data={items}
        isLoading={isLoading}
        emptyState={
          <div className="py-6 px-4">
            <EmptyState
              icon={<HiOutlineClock size={36} />}
              title="No Collaboration History"
              description="No past projects or collaboration records found for this profile."
            />
          </div>
        }
      />
    </div>
  );
};
