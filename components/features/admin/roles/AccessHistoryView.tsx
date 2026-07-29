"use client";

import React from "react";
import Link from "next/link";
import { 
  HiOutlineSearch, 
  HiOutlineClock, 
  HiOutlineDesktopComputer, 
  HiOutlineExclamationCircle,
  HiOutlineArrowRight
} from "react-icons/hi";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Table } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { ExportCSVButton } from "@/components/ui/ExportCSVButton";
import { AdminRolesSubNav } from "./AdminRolesSubNav";
import { useAccessHistory } from "@/hooks/admin/useAccessHistory";
import { AccessHistoryLog } from "@/services/admin/roles.service";

const getRoleBadgeStyle = (roleKey: string) => {
  switch (roleKey.toUpperCase()) {
    case "SUPER_ADMIN":
      return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30";
    case "SUPPORT_ADMIN":
      return "bg-primary-blue/20 text-secondary-blue border border-primary-blue/30";
    case "FINANCE_ADMIN":
      return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30";
    case "VERIFICATION_ADMIN":
      return "bg-purple-500/15 text-purple-400 border border-purple-500/30";
    case "MARKETPLACE_MODERATOR":
      return "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30";
    default:
      return "bg-white/10 text-white/50 border border-white/10";
  }
};

const getStatusBadgeStyle = (status: AccessHistoryLog["status"]) => {
  switch (status) {
    case "Success":
      return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30";
    case "Failed":
      return "bg-red-500/15 text-red-400 border border-red-500/30";
    case "Locked":
      return "bg-amber-500/15 text-amber-400 border border-amber-500/30";
    default:
      return "bg-white/10 text-white/50 border border-white/10";
  }
};

export const AccessHistoryView: React.FC = () => {
  const {
    logs,
    allLogs,
    suspiciousCount,
    isLoading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
  } = useAccessHistory();

  const breadcrumbItems = [
    { label: "Admin Portal", href: "/admin/dashboard" },
    { label: "Admin Roles", href: "/admin/roles" },
    { label: "Access History" },
  ];

  const filterTabs = [
    { key: "ALL", label: "All Events" },
    { key: "SUCCESS", label: "Success" },
    { key: "FAILED", label: "Failed" },
    { key: "LOCKED", label: "Locked" },
  ];

  return (
    <div className="w-full flex flex-col gap-6 pb-12 animate-in fade-in duration-300">
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col gap-3">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Admin Access History
            </h1>
            <p className="text-white/40 text-sm mt-1">
              Monitor administrator login activity, device info, and suspicious access events.
            </p>
          </div>
        </div>
      </div>

      {/* Sub Navigation Bar */}
      <AdminRolesSubNav />

      {/* Suspicious Activity Warning Banner */}
      <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/30 text-red-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
            <HiOutlineExclamationCircle size={20} />
          </div>
          <span className="text-xs md:text-sm font-semibold">
            {suspiciousCount} suspicious login attempts detected in the last 24 hours.
          </span>
        </div>
        <button
          onClick={() => setStatusFilter("FAILED")}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300 hover:underline cursor-pointer shrink-0"
        >
          <span>View in Audit Logs</span>
          <HiOutlineArrowRight size={14} />
        </button>
      </div>

      {/* Controls & Event Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 flex-1">
          {/* Search Box */}
          <div className="relative flex-1 w-full max-w-md">
            <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input
              type="text"
              placeholder="Search by name or IP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary-green/50 transition-all"
            />
          </div>

          {/* Event Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar w-full sm:w-auto">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === tab.key
                    ? "bg-[#72c043] text-[#0d0f10] shadow-sm font-bold"
                    : "bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Export Action */}
        <div className="shrink-0">
          <ExportCSVButton
            data={logs}
            filename="collabden-access-logs.csv"
            headers={[
              { label: "ID", key: "id" },
              { label: "Administrator", key: "adminName" },
              { label: "Role", key: "roleName" },
              { label: "Timestamp", key: "timestamp" },
              { label: "Device", key: "device" },
              { label: "IP Address", key: "ipAddress" },
              { label: "Status", key: "status" },
            ]}
          />
        </div>
      </div>

      {/* Main Access History Table */}
      <Table
        columns={[
          {
            key: "administrator",
            label: "ADMINISTRATOR",
            render: (log: AccessHistoryLog) => (
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 ${
                  log.isSuspicious ? "bg-red-500/20 border-red-500/40 text-red-400" : "bg-white/10 border-white/10 text-white"
                }`}>
                  {log.initials}
                </div>
                <span className={`font-semibold text-sm ${log.isSuspicious ? "text-red-300" : "text-white"}`}>
                  {log.adminName}
                </span>
              </div>
            ),
          },
          {
            key: "role",
            label: "ROLE",
            render: (log: AccessHistoryLog) => (
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getRoleBadgeStyle(log.roleKey)}`}>
                {log.roleName}
              </span>
            ),
          },
          {
            key: "timestamp",
            label: "DATE & TIME",
            render: (log: AccessHistoryLog) => (
              <div className="flex items-center gap-2 text-sm text-white/70">
                <HiOutlineClock size={15} className="text-white/40 shrink-0" />
                <span>{log.timestamp}</span>
              </div>
            ),
          },
          {
            key: "device",
            label: "DEVICE",
            render: (log: AccessHistoryLog) => (
              <div className="flex items-center gap-2 text-sm text-white/70">
                <HiOutlineDesktopComputer size={15} className="text-white/40 shrink-0" />
                <span>{log.device}</span>
              </div>
            ),
          },
          {
            key: "ipAddress",
            label: "IP ADDRESS",
            render: (log: AccessHistoryLog) => (
              <span className="text-sm font-mono text-white/80">{log.ipAddress}</span>
            ),
          },
          {
            key: "status",
            label: "STATUS",
            render: (log: AccessHistoryLog) => (
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusBadgeStyle(log.status)}`}>
                {log.status}
              </span>
            ),
          },
        ]}
        data={logs}
        isLoading={isLoading}
        loadingState={<div className="py-8 text-center text-white/40">Loading access history...</div>}
        emptyState={<div className="py-8 text-center text-white/40">No access history events found.</div>}
      />

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <span className="text-xs text-white/40 font-medium">
          Showing {logs.length} of {allLogs.length} entries · Read-only — history cannot be modified
        </span>

        <Pagination
          currentPage={page}
          totalPages={27}
          onPageChange={setPage}
          currentItemsCount={logs.length}
          totalItems={allLogs.length}
          itemName="logs"
        />
      </div>
    </div>
  );
};

export default AccessHistoryView;
