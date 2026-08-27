"use client";

import React, { useState, useEffect } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Table, Column } from "@/components/ui/Table";
import { ExportCSVButton } from "@/components/ui/ExportCSVButton";
import { VerifySubNav } from "./VerifySubNav";
import { verificationService } from "@/services/admin/verification.service";

export const AdminVerifyAuditView: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAudit() {
      setIsLoading(true);
      try {
        const res = await verificationService.getVerificationAuditHistory();
        const body = res?.data || res;
        const items = body?.logs || body?.auditLogs || (Array.isArray(body) ? body : []);
        setAuditLogs(items);
      } catch (err) {
        console.error("Failed to load verification audit logs:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAudit();
  }, []);

  const breadcrumbItems = [
    { label: "Admin Portal", href: "/admin/dashboard" },
    { label: "Verification", href: "/admin/verify" },
    { label: "Audit Log & History" },
  ];

  const columns: Column<any>[] = [
    {
      key: "action",
      label: "ACTION / EVENT",
      render: (row) => <span className="text-xs font-bold text-white font-sans">{row.action || "Verification Decision"}</span>,
    },
    {
      key: "administrator",
      label: "ADMINISTRATOR",
      render: (row) => <span className="text-xs font-semibold text-[#73BF44]">{row.administrator || row.adminName || "Verification Admin"}</span>,
    },
    {
      key: "role",
      label: "ROLE",
      render: (row) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#6495ED]/10 text-[#6495ED] border border-[#6495ED]/20">
          {row.role || "Admin Reviewer"}
        </span>
      ),
    },
    {
      key: "targetUser",
      label: "TARGET USER",
      render: (row) => <span className="text-xs text-white">{row.targetUser || row.userName || "Amara Osei"}</span>,
    },
    {
      key: "details",
      label: "DETAILS",
      render: (row) => <span className="text-xs text-[#AEB2B4]">{row.details || row.description}</span>,
    },
    {
      key: "timestamp",
      label: "TIMESTAMP",
      render: (row) => <span className="text-xs text-[#AEB2B4] font-mono">{row.timestamp || row.createdAt}</span>,
    },
  ];

  return (
    <div className="w-full flex flex-col gap-6 pb-12 animate-in fade-in duration-300">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight font-sans">Verification Audit Trail</h1>
          <p className="text-sm text-[#AEB2B4] mt-1">
            Review complete decision audit log, status change records, and reviewer activities.
          </p>
        </div>
        <ExportCSVButton data={auditLogs} filename="verification-audit-trail.csv" />
      </div>

      {/* Reusable Sub-Nav */}
      <VerifySubNav />

      {/* Audit Log Table */}
      <div className="p-6 rounded-2xl bg-card-bg-alt/30 border border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-sans">Historical Audit Log</h3>
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-[#73BF44] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#AEB2B4] mt-3">Loading verification audit trail...</p>
          </div>
        ) : (
          <Table columns={columns} data={auditLogs} />
        )}
      </div>
    </div>
  );
};

export default AdminVerifyAuditView;
