"use client";

import React, { useState } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Table, Column } from "@/components/ui/Table";
import { ExportCSVButton } from "@/components/ui/ExportCSVButton";
import EmptyState from "@/components/ui/EmptyState";
import { HiOutlineLockClosed } from "react-icons/hi";
import { useAdminPayments } from "@/hooks/admin/useAdminPayments";
import { PaymentAuditEntry } from "@/services/admin/payments.service";

export const PaymentReportsView: React.FC = () => {
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const { auditLogs, isLoadingAuditLogs } = useAdminPayments({
    loadStats: false,
    loadTransactions: false,
    loadAuditLogs: true,
  });

  const auditColumns: Column<PaymentAuditEntry>[] = [
    {
      key: "indexNumber",
      label: "#",
      render: (row) => <span className="font-mono text-xs text-white/50">{row.indexNumber}</span>,
    },
    {
      key: "actionPerformed",
      label: "ACTION PERFORMED",
      render: (row) => <span className="text-xs font-bold text-white">{row.actionPerformed}</span>,
    },
    {
      key: "administratorName",
      label: "ADMINISTRATOR",
      render: (row) => (
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
      render: (row) => (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary-blue/20 text-secondary-blue border border-primary-blue/30">
          {row.role}
        </span>
      ),
    },
    {
      key: "target",
      label: "TARGET",
      render: (row) => <span className="font-mono text-xs text-white/80">{row.target}</span>,
    },
    {
      key: "reason",
      label: "REASON",
      render: (row) => <span className="text-xs text-text-muted">{row.reason}</span>,
    },
    {
      key: "dateTime",
      label: "DATE & TIME",
      render: (row) => <span className="text-xs font-mono text-white/60">{row.dateTime}</span>,
    },
  ];

  return (
    <div className="w-full flex flex-col gap-8 pb-12 animate-in fade-in duration-300">
      {/* Breadcrumb Trail */}
      <Breadcrumbs
        items={[
          { label: "Admin Portal" },
          { label: "Payments", href: "/admin/payments" },
          { label: "Reports & Audit History" },
        ]}
      />

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight font-sans">
            Payment Reports & Audit History
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Generate financial reports, review gross revenue volume, and audit administrative payment actions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-white/5 border border-white/10 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-primary-green cursor-pointer"
          >
            <option value="Last 7 Days" className="bg-[#0d0f10]">Last 7 Days</option>
            <option value="Last 30 Days" className="bg-[#0d0f10]">Last 30 Days</option>
            <option value="Last 90 Days" className="bg-[#0d0f10]">Last 90 Days</option>
            <option value="Year to Date" className="bg-[#0d0f10]">Year to Date</option>
          </select>
          <ExportCSVButton
            data={auditLogs}
            filename="payment-audit-logs.csv"
            headers={[
              { label: "Index", key: "indexNumber" },
              { label: "Action", key: "actionPerformed" },
              { label: "Admin", key: "administratorName" },
              { label: "Role", key: "role" },
              { label: "Target", key: "target" },
              { label: "Reason", key: "reason" },
              { label: "Date", key: "dateTime" },
            ]}
          />
        </div>
      </div>

      {/* Financial Summary Metric Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-card-bg-alt/30 border border-white/5 flex flex-col gap-1">
          <span className="text-xs text-text-muted uppercase tracking-wider font-semibold">Gross Volume</span>
          <span className="text-2xl font-bold text-white font-mono">$4,850,200</span>
        </div>
        <div className="p-5 rounded-2xl bg-card-bg-alt/30 border border-white/5 flex flex-col gap-1">
          <span className="text-xs text-text-muted uppercase tracking-wider font-semibold">Refunds Issued</span>
          <span className="text-2xl font-bold text-accent-red font-mono">-$24,100</span>
        </div>
        <div className="p-5 rounded-2xl bg-card-bg-alt/30 border border-white/5 flex flex-col gap-1">
          <span className="text-xs text-text-muted uppercase tracking-wider font-semibold">Platform Revenue (10%)</span>
          <span className="text-2xl font-bold text-primary-green font-mono">$482,610</span>
        </div>
        <div className="p-5 rounded-2xl bg-card-bg-alt/30 border border-white/5 flex flex-col gap-1">
          <span className="text-xs text-text-muted uppercase tracking-wider font-semibold">Net Escrow Retained</span>
          <span className="text-2xl font-bold text-secondary-blue font-mono">$420,000</span>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-card-bg-alt/30 border border-white/5 rounded-2xl p-4 flex flex-col gap-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted border-b border-white/5 pb-3">
          Payment Audit Trail
        </h3>
        <Table
          columns={auditColumns}
          data={auditLogs}
          isLoading={isLoadingAuditLogs}
          emptyState={
            <div className="py-6 px-4">
              <EmptyState
                icon={<HiOutlineLockClosed size={36} />}
                title="No Audit Entries Recorded"
                description="No administrative payment actions have been logged yet."
              />
            </div>
          }
        />
      </div>
    </div>
  );
};
