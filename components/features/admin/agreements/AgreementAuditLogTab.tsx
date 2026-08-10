"use client";

import React, { useState } from "react";
import { HiOutlineShieldCheck, HiOutlineLockClosed, HiOutlineSearch } from "react-icons/hi";
import { Table, Column } from "@/components/ui/Table";
import { ExportCSVButton } from "@/components/ui/ExportCSVButton";

export interface AuditLogRow {
  id: string;
  indexNumber: number;
  actionPerformed: string;
  isSensitive?: boolean;
  administratorName: string;
  role: string;
  reason: string;
  dateTime: string;
}

interface AgreementAuditLogTabProps {
  logs?: AuditLogRow[];
  agreementTitle?: string;
  agreementId?: string;
  isLoading?: boolean;
}

export const AgreementAuditLogTab: React.FC<AgreementAuditLogTabProps> = ({
  logs = [],
  agreementTitle = "Agreement Project",
  agreementId = "AGR-0000",
  isLoading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const rows: AuditLogRow[] = Array.isArray(logs) ? logs : [];

  const filteredRows = rows.filter((r) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      r.actionPerformed.toLowerCase().includes(term) ||
      r.administratorName.toLowerCase().includes(term) ||
      r.role.toLowerCase().includes(term) ||
      r.reason.toLowerCase().includes(term)
    );
  });

  const columns: Column<AuditLogRow>[] = [
    {
      key: "indexNumber",
      label: "#",
      render: (row: AuditLogRow) => <span className="font-mono text-xs text-white/50">{row.indexNumber}</span>,
    },
    {
      key: "actionPerformed",
      label: "ACTION PERFORMED",
      render: (row: AuditLogRow) => (
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-white">{row.actionPerformed}</span>
          {row.isSensitive && (
            <span className="w-fit px-2 py-0.5 rounded-md text-[10px] font-bold bg-accent-soft-green text-accent-green-success border border-accent-green-success/30">
              Sensitive Action
            </span>
          )}
        </div>
      ),
    },
    {
      key: "administratorName",
      label: "ADMINISTRATOR",
      render: (row: AuditLogRow) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-card-bg border border-white/10 flex items-center justify-center text-[10px] font-bold text-white uppercase">
            {row.administratorName[0]}
          </div>
          <span className="text-xs font-medium text-white/90">{row.administratorName}</span>
        </div>
      ),
    },
    {
      key: "role",
      label: "ROLE",
      render: (row: AuditLogRow) => (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary-blue/20 text-secondary-blue border border-primary-blue/30">
          {row.role}
        </span>
      ),
    },
    {
      key: "reason",
      label: "REASON",
      render: (row: AuditLogRow) => <span className="text-xs text-text-muted">{row.reason}</span>,
    },
    {
      key: "dateTime",
      label: "DATE & TIME",
      render: (row: AuditLogRow) => <span className="text-xs font-mono text-white/60">{row.dateTime}</span>,
    },
  ];

  return (
    <div className="p-6 md:p-8 flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Top Header & Export */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight font-sans">
            Agreement Audit Log
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            {agreementId} - {agreementTitle} • All administrative access and actions logged.
          </p>
        </div>
        <ExportCSVButton
          data={rows}
          filename={`audit-log-${agreementId}.csv`}
          headers={[
            { label: "Index", key: "indexNumber" },
            { label: "Action", key: "actionPerformed" },
            { label: "Admin", key: "administratorName" },
            { label: "Role", key: "role" },
            { label: "Reason", key: "reason" },
            { label: "Date & Time", key: "dateTime" },
          ]}
        />
      </div>

      {/* Security Governance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-white/2 border border-white/5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-secondary-blue shrink-0">
            <HiOutlineLockClosed size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white">Read-Only Records</span>
            <span className="text-[11px] text-text-muted">Audit entries cannot be edited or deleted.</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/2 border border-white/5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary-green shrink-0">
              <HiOutlineShieldCheck size={22} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">Secure Audit Trail</span>
              <span className="text-[11px] text-text-muted">All actions encrypted and cryptographically logged.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md w-full">
        <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
        <input
          type="text"
          placeholder="Search audit records..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-primary-green transition-colors"
        />
      </div>

      {/* Audit Log Table */}
      <div className="bg-card-bg-alt/30 border border-white/5 rounded-2xl p-4 flex flex-col gap-4">
        <Table columns={columns} data={filteredRows} isLoading={isLoading} emptyState={<div className="py-8 text-center text-white/40">No audit records logged for this agreement.</div>} />

        {/* Footer Retention Notice */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-white/5 text-xs text-text-muted">
          <span>Showing {filteredRows.length} of {rows.length} entries • Retention period: 7 years</span>
          <span className="inline-flex items-center gap-1.5 text-primary-green font-semibold">
            <HiOutlineShieldCheck size={16} /> Cryptographically Sealed
          </span>
        </div>
      </div>
    </div>
  );
};
