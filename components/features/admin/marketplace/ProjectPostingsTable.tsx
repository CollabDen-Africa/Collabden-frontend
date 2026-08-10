"use client";

import React from "react";
import { Table, Column } from "@/components/ui/Table";

export interface ProjectPostingRow {
  id: string;
  title: string;
  postId: string;
  ownerName: string;
  ownerAvatar?: string;
  requiredRoles: string[];
  genres: string[];
  applications: number;
  status: "Active" | "Reported" | "Restricted" | "Closed";
}

interface ProjectPostingsTableProps {
  data: ProjectPostingRow[];
  isLoading?: boolean;
}

const StatusPill: React.FC<{ status: ProjectPostingRow["status"] }> = ({ status }) => {
  const badgeStyles: Record<ProjectPostingRow["status"], string> = {
    Active: "bg-accent-soft-green text-accent-green-success border border-accent-green-success/20",
    Reported: "bg-accent-soft-red text-accent-red border border-accent-red/20",
    Restricted: "bg-accent-yellow/10 text-accent-yellow border border-accent-yellow/20",
    Closed: "bg-white/10 text-white/40 border border-white/10",
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badgeStyles[status] || badgeStyles.Active}`}>
      {status}
    </span>
  );
};

export const ProjectPostingsTable: React.FC<ProjectPostingsTableProps> = ({ data, isLoading }) => {
  const columns: Column<ProjectPostingRow>[] = [
    {
      key: "title",
      label: "PROJECT POSTING",
      render: (row: ProjectPostingRow) => (
        <span className="text-sm font-semibold text-white group-hover:text-primary-green transition-colors">
          {row.title}
        </span>
      ),
    },
    {
      key: "postId",
      label: "POST ID",
      render: (row: ProjectPostingRow) => (
        <span className="text-xs font-mono text-white/60">{row.postId}</span>
      ),
    },
    {
      key: "owner",
      label: "OWNER",
      render: (row: ProjectPostingRow) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-card-bg flex items-center justify-center text-[10px] font-bold text-white uppercase border border-white/10">
            {row.ownerName[0]}
          </div>
          <span className="text-xs text-white/80">{row.ownerName}</span>
        </div>
      ),
    },
    {
      key: "roles",
      label: "REQUIRED ROLES",
      render: (row: ProjectPostingRow) => (
        <div className="flex flex-wrap items-center gap-1.5 max-w-50">
          {row.requiredRoles.map((role, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-primary-blue/20 text-secondary-blue border border-primary-blue/30"
            >
              {role}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: "genres",
      label: "GENRES",
      render: (row: ProjectPostingRow) => (
        <div className="flex flex-wrap items-center gap-1.5 max-w-45">
          {row.genres.map((genre, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-white/5 text-white/70 border border-white/10"
            >
              {genre}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: "applications",
      label: "APPLICATIONS",
      render: (row: ProjectPostingRow) => (
        <span className="text-xs font-semibold text-white/90">{row.applications}</span>
      ),
    },
    {
      key: "status",
      label: "STATUS",
      render: (row: ProjectPostingRow) => <StatusPill status={row.status} />,
    },
  ];

  return (
    <Table
      columns={columns}
      data={data}
      isLoading={isLoading}
      emptyState={<div className="py-8 text-center text-white/40">No project postings found.</div>}
    />
  );
};
