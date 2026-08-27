"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { HiOutlineSearch, HiOutlineExclamationCircle } from "react-icons/hi";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { StatCard } from "@/components/features/admin/shared/StatCard";
import { Table, Column } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { ExportCSVButton } from "@/components/ui/ExportCSVButton";
import EmptyState from "@/components/ui/EmptyState";
import { VerifySubNav } from "./VerifySubNav";
import { useAdminVerification } from "@/hooks/admin/useAdminVerification";
import { VerificationItem } from "@/services/admin/verification.service";

const TYPE_BADGE_STYLES: Record<string, string> = {
  "Selfie + ID": "bg-[#73BF44]/10 text-[#73BF44] border border-[#73BF44]/20",
  "Identity Document": "bg-[#6495ED]/10 text-[#6495ED] border border-[#6495ED]/20",
  "Artist Portfolio": "bg-[#FBBC04]/10 text-[#FBBC04] border border-[#FBBC04]/20",
  "Business Reg.": "bg-white/5 text-[#AEB2B4] border border-white/10",
};

const STATUS_BADGE_STYLES: Record<string, string> = {
  Pending: "bg-[#6495ED]/10 text-[#6495ED] border border-[#6495ED]/20",
  "Under Review": "bg-[#FBBC04]/10 text-[#FBBC04] border border-[#FBBC04]/20",
  Approved: "bg-[#73BF44]/10 text-[#73BF44] border border-[#73BF44]/20",
  Rejected: "bg-[#FF0404]/10 text-[#FF0404] border border-[#FF0404]/20",
  Expired: "bg-white/5 text-[#AEB2B4] border border-white/10",
  Incomplete: "bg-[#FF0404]/5 text-[#FF0404] border border-[#FF0404]/10",
};

export const AdminVerifyView: React.FC = () => {
  const router = useRouter();
  const {
    requests,
    total,
    stats,
    isLoading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    page,
    setPage,
  } = useAdminVerification({ page: 1, limit: 10 });

  const breadcrumbItems = [
    { label: "Admin Portal", href: "/admin/dashboard" },
    { label: "Verification Management" },
  ];

  const columns: Column<VerificationItem>[] = [
    {
      key: "requestId",
      label: "REQUEST ID",
      render: (row) => (
        <span className="font-mono text-xs font-bold text-[#73BF44]">
          {row.requestId || row.id}
        </span>
      ),
    },
    {
      key: "userName",
      label: "USER",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#73BF44]/10 border border-[#73BF44]/20 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-[#73BF44]">{row.userName.charAt(0)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">{row.userName}</span>
            <span className="text-xs text-[#AEB2B4]">{row.userId}</span>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      label: "VERIFICATION TYPE",
      render: (row) => (
        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${TYPE_BADGE_STYLES[row.type] || "bg-white/5 text-white"}`}>
          {row.type}
        </span>
      ),
    },
    {
      key: "status",
      label: "STATUS",
      render: (row) => (
        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${STATUS_BADGE_STYLES[row.status] || "bg-white/5 text-white"}`}>
          {row.status}
        </span>
      ),
    },
    {
      key: "attempts",
      label: "ATTEMPTS",
      render: (row) => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
          row.attempts > 1 ? "bg-[#FBBC04]/10 text-[#FBBC04] border border-[#FBBC04]/20" : "bg-white/5 text-[#AEB2B4]"
        }`}>
          {row.attempts} {row.attempts > 1 ? "Attempts" : "Attempt"}
        </span>
      ),
    },
    {
      key: "assignedAdmin",
      label: "ASSIGNED ADMIN",
      render: (row) => <span className="text-xs text-[#AEB2B4]">{row.assignedAdmin || "—"}</span>,
    },
    {
      key: "submittedDate",
      label: "SUBMITTED DATE",
      render: (row) => <span className="text-xs text-[#AEB2B4]">{row.submittedDate}</span>,
    },
  ];

  return (
    <div className="w-full flex flex-col gap-6 pb-12 animate-in fade-in duration-300">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight font-sans">Verification Management</h1>
          <p className="text-sm text-[#AEB2B4] mt-1">
            Review identity verification requests, audit submitted documents, and manage approval decisions across the platform.
          </p>
        </div>
        <ExportCSVButton
          data={requests}
          filename="verification-requests.csv"
          headers={[
            { label: "Request ID", key: "requestId" },
            { label: "User", key: "userName" },
            { label: "User ID", key: "userId" },
            { label: "Type", key: "type" },
            { label: "Status", key: "status" },
            { label: "Attempts", key: "attempts" },
            { label: "Submitted Date", key: "submittedDate" },
          ]}
        />
      </div>

      {/* Reusable Sub-Nav */}
      <VerifySubNav />

      {/* Metric Stat Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label="Total Requests" value={stats.totalRequests.toLocaleString()} color="bg-[#444444]" />
        <StatCard label="Pending Review" value={stats.pendingReview.toLocaleString()} color="bg-[#6495ED]" />
        <StatCard label="Under Review" value={stats.underReview.toLocaleString()} color="bg-[#FBBC04]" />
        <StatCard label="Approved" value={stats.approved.toLocaleString()} color="bg-[#73BF44]" />
        <StatCard label="Rejected" value={stats.rejected.toLocaleString()} color="bg-[#FF0404]" isRedAlert={stats.rejected > 0} />
        <StatCard label="Expired / Incomplete" value={stats.expiredIncomplete.toLocaleString()} color="bg-[#444444]" />
      </div>

      {/* Critical Alert Banner */}
      {stats.pendingReview > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#6495ED]/10 border border-[#6495ED]/20 text-[#6495ED] text-xs font-semibold">
          <HiOutlineExclamationCircle size={20} className="shrink-0 text-[#6495ED]" />
          <span>
            <strong>{stats.pendingReview} identity verification requests</strong> are currently pending reviewer decision. Priority: Unresolved selfie match for VRQ-0814.
          </span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AEB2B4]" size={16} />
          <input
            type="text"
            placeholder="Search by user, request ID..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-[#AEB2B4]/40 focus:outline-none focus:border-[#73BF44]/40 transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/80 focus:outline-none focus:border-[#73BF44]/40 cursor-pointer"
          >
            <option value="ALL" className="bg-[#1a1d1f]">Status: All</option>
            <option value="Pending" className="bg-[#1a1d1f]">Pending</option>
            <option value="Under Review" className="bg-[#1a1d1f]">Under Review</option>
            <option value="Approved" className="bg-[#1a1d1f]">Approved</option>
            <option value="Rejected" className="bg-[#1a1d1f]">Rejected</option>
            <option value="Expired" className="bg-[#1a1d1f]">Expired</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/80 focus:outline-none focus:border-[#73BF44]/40 cursor-pointer"
          >
            <option value="ALL" className="bg-[#1a1d1f]">Type: All</option>
            <option value="Selfie + ID" className="bg-[#1a1d1f]">Selfie + ID</option>
            <option value="Identity Document" className="bg-[#1a1d1f]">Identity Document</option>
            <option value="Artist Portfolio" className="bg-[#1a1d1f]">Artist Portfolio</option>
            <option value="Business Reg." className="bg-[#1a1d1f]">Business Reg.</option>
          </select>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-card-bg-alt/20 rounded-2xl border border-white/5 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-[#73BF44] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#AEB2B4] mt-3">Loading verification requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <EmptyState
            title="No verification requests found"
            description="No verification items match your current search or filter criteria."
            icon={<HiOutlineExclamationCircle size={36} />}
          />
        ) : (
          <Table
            columns={columns}
            data={requests}
            onRowClick={(row) => router.push(`/admin/verify/${row.id || row.requestId}`)}
          />
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={Math.ceil(total / 10) || 1}
        onPageChange={setPage}
        currentItemsCount={requests.length}
        totalItems={total}
        itemName="requests"
      />
    </div>
  );
};

export default AdminVerifyView;
