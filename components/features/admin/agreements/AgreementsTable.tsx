"use client";

import React from "react";
import { Table, Column } from "@/components/ui/Table";
import { useRouter } from "next/navigation";

export interface CollaboratorItem {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface AgreementRow {
  id: string;
  agreementId: string;
  projectName: string;
  ownerName: string;
  ownerAvatar?: string;
  collaborators: CollaboratorItem[];
  status: "Signed" | "Pending Signatures" | "Disputed" | "Draft";
  dateSigned: string;
}

interface AgreementsTableProps {
  data: AgreementRow[];
  isLoading?: boolean;
}

const StatusBadge: React.FC<{ status: AgreementRow["status"] }> = ({ status }) => {
  const badgeStyles: Record<AgreementRow["status"], string> = {
    Signed: "bg-accent-soft-green text-accent-green-success border border-accent-green-success/20",
    "Pending Signatures": "bg-primary-blue/20 text-secondary-blue border border-primary-blue/30",
    Disputed: "bg-accent-soft-red text-accent-red border border-accent-red/20",
    Draft: "bg-accent-yellow/10 text-accent-yellow border border-accent-yellow/20",
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badgeStyles[status] || badgeStyles.Signed}`}>
      {status}
    </span>
  );
};

export const AgreementsTable: React.FC<AgreementsTableProps> = ({ data, isLoading }) => {
  const router = useRouter();

  const columns: Column<AgreementRow>[] = [
    {
      key: "agreementId",
      label: "AGREEMENT ID",
      render: (row: AgreementRow) => (
        <span className="font-mono text-xs font-semibold text-white/90 group-hover:text-primary-green transition-colors">
          {row.agreementId}
        </span>
      ),
    },
    {
      key: "projectName",
      label: "PROJECT",
      render: (row: AgreementRow) => (
        <span className="text-sm font-semibold text-white group-hover:text-primary-green transition-colors">
          {row.projectName}
        </span>
      ),
    },
    {
      key: "ownerName",
      label: "PROJECT OWNER",
      render: (row: AgreementRow) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-card-bg flex items-center justify-center text-[10px] font-bold text-white uppercase border border-white/10 shrink-0">
            {row.ownerName[0]}
          </div>
          <span className="text-xs text-white/80">{row.ownerName}</span>
        </div>
      ),
    },
    {
      key: "collaborators",
      label: "COLLABORATORS",
      render: (row: AgreementRow) => (
        <div className="flex items-center -space-x-1.5 overflow-hidden max-w-45">
          {row.collaborators.slice(0, 3).map((collab, idx) => (
            <div
              key={idx}
              className="w-6 h-6 rounded-full bg-card-bg border border-white/20 flex items-center justify-center text-[9px] font-bold text-white uppercase"
              title={collab.name}
            >
              {collab.name[0]}
            </div>
          ))}
          {row.collaborators.length > 3 && (
            <span className="text-[10px] font-bold text-text-muted pl-2">
              +{row.collaborators.length - 3}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "status",
      label: "STATUS",
      render: (row: AgreementRow) => <StatusBadge status={row.status} />,
    },
    {
      key: "dateSigned",
      label: "DATE SIGNED",
      render: (row: AgreementRow) => (
        <span className="text-xs text-text-muted">{row.dateSigned}</span>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={data}
      isLoading={isLoading}
      onRowClick={(row) => router.push(`/admin/agreements/${row.id}`)}
      emptyState={<div className="py-8 text-center text-white/40">No legal agreements found.</div>}
    />
  );
};
