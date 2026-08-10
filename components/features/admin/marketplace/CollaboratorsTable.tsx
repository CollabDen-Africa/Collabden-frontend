"use client";

import React from "react";
import { Table, Column } from "@/components/ui/Table";
import { useRouter } from "next/navigation";

export interface CollaboratorProfileRow {
  id: string;
  name: string;
  email: string;
  profileId: string;
  roles: string[];
  genres: string[];
  location: string;
  rating: number;
  collabs: number;
  status: "Active" | "Reported" | "Restricted" | "Removed";
  avatarUrl?: string;
}

interface CollaboratorsTableProps {
  data: CollaboratorProfileRow[];
  isLoading?: boolean;
}

const StatusPill: React.FC<{ status: CollaboratorProfileRow["status"] }> = ({ status }) => {
  const badgeStyles: Record<CollaboratorProfileRow["status"], string> = {
    Active: "bg-accent-soft-green text-accent-green-success border border-accent-green-success/20",
    Reported: "bg-accent-soft-red text-accent-red border border-accent-red/20",
    Restricted: "bg-accent-yellow/10 text-accent-yellow border border-accent-yellow/20",
    Removed: "bg-white/10 text-white/40 border border-white/10",
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badgeStyles[status] || badgeStyles.Active}`}>
      {status}
    </span>
  );
};

export const CollaboratorsTable: React.FC<CollaboratorsTableProps> = ({ data, isLoading }) => {
  const router = useRouter();

  const columns: Column<CollaboratorProfileRow>[] = [
    {
      key: "collaborator",
      label: "COLLABORATOR",
      render: (row: CollaboratorProfileRow) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-card-bg flex items-center justify-center text-white font-bold text-xs uppercase border border-white/10 shrink-0">
            {row.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white group-hover:text-primary-green transition-colors">
              {row.name}
            </span>
            <span className="text-xs text-white/40">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: "profileId",
      label: "PROFILE ID",
      render: (row: CollaboratorProfileRow) => (
        <span className="text-xs font-mono text-white/60">{row.profileId}</span>
      ),
    },
    {
      key: "roles",
      label: "ROLES",
      render: (row: CollaboratorProfileRow) => (
        <div className="flex flex-wrap items-center gap-1.5 max-w-50">
          {row.roles.map((role, idx) => (
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
      render: (row: CollaboratorProfileRow) => (
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
      key: "location",
      label: "LOCATION",
      render: (row: CollaboratorProfileRow) => (
        <span className="text-xs text-white/70">{row.location}</span>
      ),
    },
    {
      key: "rating",
      label: "RATING",
      render: (row: CollaboratorProfileRow) => (
        <span className="text-xs font-bold text-accent-yellow flex items-center gap-1">
          ★ {row.rating.toFixed(1)}
        </span>
      ),
    },
    {
      key: "collabs",
      label: "COLLABS",
      render: (row: CollaboratorProfileRow) => (
        <span className="text-xs font-semibold text-white/90">{row.collabs}</span>
      ),
    },
    {
      key: "status",
      label: "STATUS",
      render: (row: CollaboratorProfileRow) => <StatusPill status={row.status} />,
    },
  ];

  return (
    <Table
      columns={columns}
      data={data}
      isLoading={isLoading}
      onRowClick={(row) => router.push(`/admin/marketplace/${row.id}`)}
      emptyState={<div className="py-8 text-center text-white/40">No collaborator profiles found.</div>}
    />
  );
};
