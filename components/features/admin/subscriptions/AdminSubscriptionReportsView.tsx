"use client";

import React from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { StatCard } from "@/components/features/admin/shared/StatCard";
import { Table, Column } from "@/components/ui/Table";
import { ExportCSVButton } from "@/components/ui/ExportCSVButton";
import { SubscriptionsSubNav } from "./SubscriptionsSubNav";
import { useAdminSubscriptionReports } from "@/hooks/admin/useAdminSubscriptionReports";
import {
  HiOutlineDocumentReport,
  HiOutlineDownload,
  HiOutlineChartBar,
} from "react-icons/hi";

export const AdminSubscriptionReportsView: React.FC = () => {
  const {
    reportsData,
    isLoading,
    dateRange,
    setDateRange,
    planFilter,
    setPlanFilter,
    paymentStatusFilter,
    setPaymentStatusFilter,
    generateReport,
  } = useAdminSubscriptionReports();

  const breadcrumbItems = [
    { label: "Admin Portal", href: "/admin/dashboard" },
    { label: "Subscriptions", href: "/admin/subscriptions" },
    { label: "Reports & Audit" },
  ];

  const auditColumns: Column<any>[] = [
    {
      key: "action",
      label: "ACTION / EVENT",
      render: (row) => <span className="text-xs font-bold text-white font-sans">{row.action}</span>,
    },
    {
      key: "administrator",
      label: "ADMINISTRATOR",
      render: (row) => (
        <span className="text-xs font-semibold text-[#73BF44]">{row.administrator}</span>
      ),
    },
    {
      key: "role",
      label: "ROLE",
      render: (row) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#6495ED]/10 text-[#6495ED] border border-[#6495ED]/20">
          {row.role}
        </span>
      ),
    },
    {
      key: "details",
      label: "DETAILS",
      render: (row) => <span className="text-xs text-[#AEB2B4]">{row.details}</span>,
    },
    {
      key: "dateTime",
      label: "DATE & TIME",
      render: (row) => <span className="text-xs text-[#AEB2B4] font-mono">{row.dateTime}</span>,
    },
  ];

  return (
    <div className="w-full flex flex-col gap-6 pb-12 animate-in fade-in duration-300">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight font-sans">Subscription Reports & Audit</h1>
          <p className="text-sm text-[#AEB2B4] mt-1">
            Generate billing reports, revenue metrics, and view subscription audit trail.
          </p>
        </div>

        <button
          onClick={() => generateReport()}
          className="px-4 py-2.5 rounded-xl bg-[#73BF44] text-[#505050] text-xs font-bold hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer shadow-md"
        >
          <HiOutlineDocumentReport size={16} /> Generate Report
        </button>
      </div>

      {/* Reusable Sub-Nav */}
      <SubscriptionsSubNav />

      {/* Report Generator Controls */}
      <div className="p-6 rounded-2xl bg-card-bg-alt/30 border border-white/10 space-y-4">
        <h3 className="text-xs font-bold text-[#AEB2B4] uppercase tracking-wider font-sans">Generate Subscription Report</h3>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white cursor-pointer"
          >
            <option value="Jul 1 - Jul 31, 2025" className="bg-[#1a1d1f]">Jul 1 - Jul 31, 2025</option>
            <option value="Last 30 Days" className="bg-[#1a1d1f]">Last 30 Days</option>
            <option value="Last 90 Days" className="bg-[#1a1d1f]">Last 90 Days</option>
            <option value="Year to Date" className="bg-[#1a1d1f]">Year to Date</option>
          </select>

          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white cursor-pointer"
          >
            <option value="All Plans" className="bg-[#1a1d1f]">All Plans</option>
            <option value="Free" className="bg-[#1a1d1f]">Free</option>
            <option value="Basic" className="bg-[#1a1d1f]">Basic</option>
            <option value="Pro" className="bg-[#1a1d1f]">Pro</option>
            <option value="Enterprise" className="bg-[#1a1d1f]">Enterprise</option>
          </select>

          <select
            value={paymentStatusFilter}
            onChange={(e) => setPaymentStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white cursor-pointer"
          >
            <option value="All Statuses" className="bg-[#1a1d1f]">All Statuses</option>
            <option value="Paid" className="bg-[#1a1d1f]">Paid Only</option>
            <option value="Failed" className="bg-[#1a1d1f]">Failed Only</option>
          </select>

          <button
            onClick={() => generateReport()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#73BF44] text-[#505050] text-xs font-bold hover:brightness-110 cursor-pointer"
          >
            Generate
          </button>
        </div>
      </div>

      {/* Revenue KPI Metrics Grid */}
      {isLoading || !reportsData ? (
        <div className="p-12 text-center">
          <div className="w-8 h-8 border-2 border-[#73BF44] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#AEB2B4] mt-3">Loading report metrics...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <StatCard label="Total Revenue" value={`₦${(reportsData.totalRevenue / 1000000).toFixed(1)}M`} color="bg-primary-green" />
            <StatCard label="MRR" value={`₦${(reportsData.mrr / 1000000).toFixed(1)}M`} color="bg-primary-green" />
            <StatCard label="ARR" value={`₦${(reportsData.arr / 1000000).toFixed(1)}M`} color="bg-primary-green" />
            <StatCard label="Churn Rate" value={reportsData.churnRate} color="bg-[#444444]" />
            <StatCard label="Payment Success" value={reportsData.paymentSuccessRate} color="bg-primary-green" />
            <StatCard label="SLA Breaches" value={reportsData.slaBreaches} color="bg-accent-red" isRedAlert={reportsData.slaBreaches > 0} />
          </div>

          {/* Subscription Distribution Breakdown */}
          <div className="p-6 rounded-2xl bg-card-bg-alt/30 border border-white/10 space-y-4">
            <h3 className="text-xs font-bold text-[#AEB2B4] uppercase tracking-wider font-sans flex items-center gap-2">
              <HiOutlineChartBar className="text-[#73BF44]" size={16} /> Plan Tier Distribution Breakdown
            </h3>

            <div className="space-y-3">
              {reportsData.planDistribution.map((pd) => (
                <div key={pd.plan} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">{pd.plan} Plan</span>
                    <span className="text-[#AEB2B4] font-mono">{pd.count.toLocaleString()} subscribers ({pd.percentage}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        pd.plan === "Pro" ? "bg-[#73BF44]" : pd.plan === "Enterprise" ? "bg-[#6495ED]" : "bg-[#444444]"
                      }`}
                      style={{ width: `${pd.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Log Table */}
          <div className="p-6 rounded-2xl bg-card-bg-alt/30 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-sans">Subscription & Billing Audit Log</h3>
              <div className="flex items-center gap-2">
                <ExportCSVButton data={reportsData.auditLogs} filename="subscription-audit-logs.csv" />
                <button
                  onClick={() => alert("PDF download triggered.")}
                  className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-semibold hover:bg-white/10 flex items-center gap-1 cursor-pointer"
                >
                  <HiOutlineDownload size={14} /> Download PDF
                </button>
              </div>
            </div>

            <Table columns={auditColumns} data={reportsData.auditLogs} />
          </div>
        </>
      )}
    </div>
  );
};

export default AdminSubscriptionReportsView;
