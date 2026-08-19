"use client";

import React, { useState } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { StatCard } from "@/components/features/admin/shared/StatCard";
import { Table, Column } from "@/components/ui/Table";
import { ExportCSVButton } from "@/components/ui/ExportCSVButton";
import EmptyState from "@/components/ui/EmptyState";
import { HiOutlineLockClosed } from "react-icons/hi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { adminSupportService, SupportAuditEntry } from "@/services/admin/support.service";

export const SupportReportsView: React.FC = () => {
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Load mock reports data
  const [reportData, setReportData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      const data = await adminSupportService.getReports({ dateRange });
      setReportData(data);
      setIsLoading(false);
    };
    fetchReports();
  }, [dateRange]);

  const breadcrumbItems = [
    { label: "Admin Portal", href: "/admin/dashboard" },
    { label: "Support Management", href: "/admin/support" },
    { label: "History & Reports" },
  ];

  if (isLoading || !reportData) {
    return (
      <div className="w-full flex flex-col gap-6">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="p-12 text-center">
          <div className="w-8 h-8 border-2 border-primary-green border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-text-muted mt-3">Loading reports data...</p>
        </div>
      </div>
    );
  }

  const { stats, categoryBreakdown, auditLogs } = reportData;

  const statCards = [
    { label: "Total Tickets", value: stats.totalTickets, color: "bg-primary-green" },
    { label: "Avg Resolution", value: stats.avgResponseTime, color: "bg-primary-blue" },
    { label: "Open", value: stats.openTickets, color: "bg-accent-red" },
    { label: "In Progress", value: stats.inProgressTickets, color: "bg-accent-yellow" },
    { label: "Resolved", value: stats.resolvedTickets, color: "bg-primary-green" },
    { label: "SLA Breach Rate", value: `${((stats.slaBreaches / stats.totalTickets) * 100).toFixed(1)}%`, color: "bg-accent-red" },
  ];

  const auditColumns: Column<SupportAuditEntry>[] = [
    {
      key: "ticketId",
      label: "TICKET ID",
      render: (row) => <span className="font-mono text-xs font-bold text-primary-green">{row.ticketId}</span>,
    },
    {
      key: "action",
      label: "ACTION PERFORMED",
      render: (row) => <span className="text-xs font-semibold text-white">{row.action}</span>,
    },
    {
      key: "adminName",
      label: "ADMINISTRATOR",
      render: (row) => <span className="text-xs text-white/80">{row.adminName}</span>,
    },
    {
      key: "userName",
      label: "USER",
      render: (row) => <span className="text-xs text-white/80">{row.userName}</span>,
    },
    {
      key: "details",
      label: "DETAILS",
      render: (row) => <span className="text-xs text-text-muted">{row.details}</span>,
    },
    {
      key: "timestamp",
      label: "DATE & TIME",
      render: (row) => (
        <span className="text-xs text-text-muted">
          {new Date(row.timestamp).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })}
        </span>
      ),
    },
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Support History & Reports</h1>
          <p className="text-xs text-text-muted mt-1">
            Analyze ticketing metrics, SLA fulfillment performance, and audit actions taken.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/80 focus:outline-none cursor-pointer appearance-none"
          >
            <option value="Last 30 Days" className="bg-[#1a1d1f]">Last 30 Days</option>
            <option value="Last 90 Days" className="bg-[#1a1d1f]">Last 90 Days</option>
            <option value="Last 1 Year" className="bg-[#1a1d1f]">Last 1 Year</option>
          </select>
          <button className="px-4 py-2.5 rounded-xl bg-primary-green text-text-main text-xs font-bold hover:brightness-110 transition-all cursor-pointer">
            Generate Report
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            color={stat.color}
          />
        ))}
      </div>

      {/* Reports Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Recharts Horizontal Bar Chart */}
        <div className="lg:col-span-2 rounded-2xl bg-card-bg-alt/30 border border-white/5 p-5 flex flex-col gap-4">
          <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">
            Tickets by Category
          </h3>
          <div className="h-62.5 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={categoryBreakdown}
                margin={{ top: 10, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" stroke="rgba(255,255,255,0.3)" fontSize={10} />
                <YAxis dataKey="category" type="category" stroke="rgba(255,255,255,0.3)" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1a1d1f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                  labelStyle={{ color: "#fff", fontSize: "12px", fontWeight: "bold" }}
                  itemStyle={{ color: "#72c043", fontSize: "12px" }}
                />
                <Bar dataKey="count" fill="var(--primary-green)" radius={[0, 4, 4, 0]}>
                  {categoryBreakdown.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: SLA Compliance & Status Summary */}
        <div className="rounded-2xl bg-card-bg-alt/30 border border-white/5 p-5 flex flex-col justify-between gap-5">
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Response & SLA Tracking
            </h3>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-xs text-text-muted">Fulfillment Rate</span>
              <span className="text-xs font-bold text-primary-green">99.6%</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-xs text-text-muted">First Response SLA</span>
              <span className="text-xs font-bold text-white">15m target</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-xs text-text-muted">Total Violations</span>
              <span className="text-xs font-bold text-accent-red">{stats.slaBreaches} breaches</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-accent-red/10 border border-accent-red/20">
            <HiOutlineLockClosed className="text-accent-red shrink-0" size={16} />
            <p className="text-[10px] text-accent-red/90 leading-tight">
              SLA limits breached. Urgent follow-up actions logged in support audit system.
            </p>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-card-bg-alt/30 border border-white/5 rounded-2xl p-5 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Support Audit Log
          </h3>
          <div className="flex items-center gap-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white/80 focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-[#1a1d1f]">All Categories</option>
              <option value="Escrow" className="bg-[#1a1d1f]">Escrow</option>
              <option value="Payment" className="bg-[#1a1d1f]">Payment</option>
              <option value="Platform" className="bg-[#1a1d1f]">Platform</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white/80 focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-[#1a1d1f]">All Actions</option>
              <option value="Created" className="bg-[#1a1d1f]">Created</option>
              <option value="Assigned" className="bg-[#1a1d1f]">Assigned</option>
              <option value="Resolved" className="bg-[#1a1d1f]">Resolved</option>
            </select>
            <ExportCSVButton
              data={auditLogs}
              filename="support-audit-log"
              headers={[
                { label: "Ticket ID", key: "ticketId" },
                { label: "Action", key: "action" },
                { label: "Admin", key: "adminName" },
                { label: "User", key: "userName" },
                { label: "Details", key: "details" },
                { label: "Date & Time", key: "timestamp" },
              ]}
            />
          </div>
        </div>

        {auditLogs.length === 0 ? (
          <EmptyState
            title="No audit entries"
            description="No audit logs matched the selected criteria."
            icon={<HiOutlineLockClosed size={40} />}
          />
        ) : (
          <Table columns={auditColumns} data={auditLogs} />
        )}
      </div>
    </div>
  );
};

export default SupportReportsView;
