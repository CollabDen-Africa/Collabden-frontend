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
import { SubscriptionsSubNav } from "./SubscriptionsSubNav";
import { useAdminSubscriptions } from "@/hooks/admin/useAdminSubscriptions";
import { SubscriptionItem } from "@/services/admin/subscriptions.service";

const PLAN_BADGE_STYLES: Record<string, string> = {
  Free: "bg-white/5 text-text-muted border border-white/10",
  Basic: "bg-secondary-blue/10 text-secondary-blue border border-secondary-blue/20",
  Pro: "bg-primary-green/10 text-primary-green border border-primary-green/20",
  Enterprise: "bg-accent-pink/10 text-accent-pink border border-accent-pink/20",
};

const STATUS_BADGE_STYLES: Record<string, string> = {
  Active: "bg-primary-green/10 text-primary-green border border-primary-green/20",
  Paused: "bg-accent-yellow/10 text-accent-yellow border border-accent-yellow/20",
  Cancelled: "bg-accent-red/10 text-accent-red border border-accent-red/20",
  Expired: "bg-white/5 text-text-muted border border-white/10",
  Pending: "bg-secondary-blue/10 text-secondary-blue border border-secondary-blue/20",
};

const PAYMENT_BADGE_STYLES: Record<string, string> = {
  Paid: "bg-primary-green/10 text-primary-green border border-primary-green/20",
  Failed: "bg-accent-red/10 text-accent-red border border-accent-red/20",
  Retrying: "bg-accent-yellow/10 text-accent-yellow border border-accent-yellow/20",
  Pending: "bg-secondary-blue/10 text-secondary-blue border border-secondary-blue/20",
};

export const AdminSubscriptionsListView: React.FC = () => {
  const router = useRouter();
  const {
    subscriptions,
    total,
    isLoading,
    stats,
    searchQuery,
    setSearchQuery,
    planFilter,
    setPlanFilter,
    statusFilter,
    setStatusFilter,
    paymentStatusFilter,
    setPaymentStatusFilter,
    renewalFilter,
    setRenewalFilter,
    page,
    setPage,
  } = useAdminSubscriptions({ page: 1, limit: 10 });

  const breadcrumbItems = [
    { label: "Admin Portal", href: "/admin/dashboard" },
    { label: "Subscriptions & Billing" },
  ];

  const columns: Column<SubscriptionItem>[] = [
    {
      key: "subscriptionId",
      label: "SUBSCRIPTION ID",
      render: (row) => (
        <span className="font-mono text-xs font-bold text-primary-green">{row.subscriptionId}</span>
      ),
    },
    {
      key: "userName",
      label: "USER",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-green/10 border border-primary-green/20 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-primary-green">{row.userName.charAt(0)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">{row.userName}</span>
            <span className="text-xs text-text-muted">{row.userId}</span>
          </div>
        </div>
      ),
    },
    {
      key: "plan",
      label: "PLAN",
      render: (row) => (
        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${PLAN_BADGE_STYLES[row.plan] || ""}`}>
          {row.plan}
        </span>
      ),
    },
    {
      key: "status",
      label: "STATUS",
      render: (row) => (
        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${STATUS_BADGE_STYLES[row.status] || ""}`}>
          {row.status}
        </span>
      ),
    },
    {
      key: "startDate",
      label: "START DATE",
      render: (row) => <span className="text-xs text-text-muted">{row.startDate}</span>,
    },
    {
      key: "renewalDate",
      label: "RENEWAL DATE",
      render: (row) => <span className="text-xs text-text-muted">{row.renewalDate}</span>,
    },
    {
      key: "paymentStatus",
      label: "PAYMENT STATUS",
      render: (row) => (
        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${PAYMENT_BADGE_STYLES[row.paymentStatus] || ""}`}>
          {row.paymentStatus}
        </span>
      ),
    },
  ];

  return (
    <div className="w-full flex flex-col gap-6 pb-12 animate-in fade-in duration-300">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight font-sans">Subscription & Billing</h1>
          <p className="text-sm text-text-muted mt-1">
            Monitor premium memberships, billing records, and subscription activity across the platform.
          </p>
        </div>
        <ExportCSVButton
          data={subscriptions}
          filename="subscriptions-list.csv"
          headers={[
            { label: "Subscription ID", key: "subscriptionId" },
            { label: "User", key: "userName" },
            { label: "Email", key: "userEmail" },
            { label: "Plan", key: "plan" },
            { label: "Status", key: "status" },
            { label: "Start Date", key: "startDate" },
            { label: "Renewal Date", key: "renewalDate" },
            { label: "Payment Status", key: "paymentStatus" },
          ]}
        />
      </div>

      {/* Reusable Sub-Nav */}
      <SubscriptionsSubNav />

      {/* Metric Stat Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label="Total Subscribers" value={stats.totalSubscribers.toLocaleString()} color="bg-primary-green" />
        <StatCard label="Active" value={stats.active.toLocaleString()} color="bg-primary-green" />
        <StatCard label="Cancelled" value={stats.cancelled.toLocaleString()} color="bg-[#444444]" />
        <StatCard label="Failed Payments" value={stats.failedPayments.toLocaleString()} color="bg-accent-red" isRedAlert={stats.failedPayments > 0} />
        <StatCard label="Trials / Pending" value={stats.trialsPending.toLocaleString()} color="bg-secondary-blue" />
        <StatCard label="MRR" value={stats.mrr} color="bg-primary-green" />
      </div>

      {/* Critical Alert Banner */}
      {stats.failedPayments > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-accent-red/10 border border-accent-red/20 text-accent-red text-xs font-semibold">
          <HiOutlineExclamationCircle size={20} className="shrink-0" />
          <span>
            <strong>{stats.failedPayments} subscriptions</strong> have failed payment attempts. Critical: Unresolved SUB-1018 (Marcus Lee, Pro) — retry pending 2 days.
          </span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
          <input
            type="text"
            placeholder="Search by username, user ID, subscription ID..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-text-muted/40 focus:outline-none focus:border-primary-green/40 transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={planFilter}
            onChange={(e) => { setPlanFilter(e.target.value); setPage(1); }}
            className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/80 focus:outline-none focus:border-primary-green/40 cursor-pointer"
          >
            <option value="ALL" className="bg-[#1a1d1f]">Subscription Plan</option>
            <option value="Free" className="bg-[#1a1d1f]">Free</option>
            <option value="Basic" className="bg-[#1a1d1f]">Basic</option>
            <option value="Pro" className="bg-[#1a1d1f]">Pro</option>
            <option value="Enterprise" className="bg-[#1a1d1f]">Enterprise</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/80 focus:outline-none focus:border-primary-green/40 cursor-pointer"
          >
            <option value="ALL" className="bg-[#1a1d1f]">Subscription Status</option>
            <option value="Active" className="bg-[#1a1d1f]">Active</option>
            <option value="Paused" className="bg-[#1a1d1f]">Paused</option>
            <option value="Cancelled" className="bg-[#1a1d1f]">Cancelled</option>
            <option value="Expired" className="bg-[#1a1d1f]">Expired</option>
            <option value="Pending" className="bg-[#1a1d1f]">Pending</option>
          </select>

          <select
            value={paymentStatusFilter}
            onChange={(e) => { setPaymentStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/80 focus:outline-none focus:border-primary-green/40 cursor-pointer"
          >
            <option value="ALL" className="bg-[#1a1d1f]">Payment Status</option>
            <option value="Paid" className="bg-[#1a1d1f]">Paid</option>
            <option value="Failed" className="bg-[#1a1d1f]">Failed</option>
            <option value="Retrying" className="bg-[#1a1d1f]">Retrying</option>
            <option value="Pending" className="bg-[#1a1d1f]">Pending</option>
          </select>

          <select
            value={renewalFilter}
            onChange={(e) => setRenewalFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/80 focus:outline-none focus:border-primary-green/40 cursor-pointer"
          >
            <option value="ALL" className="bg-[#1a1d1f]">Renewal Date</option>
            <option value="THIS_MONTH" className="bg-[#1a1d1f]">This Month</option>
            <option value="NEXT_MONTH" className="bg-[#1a1d1f]">Next Month</option>
          </select>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-card-bg-alt/20 rounded-2xl border border-white/5 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-primary-green border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-text-muted mt-3">Loading subscriptions...</p>
          </div>
        ) : subscriptions.length === 0 ? (
          <EmptyState
            title="No subscriptions found"
            description="No subscriptions match your current search or filter criteria."
            icon={<HiOutlineExclamationCircle size={36} />}
          />
        ) : (
          <Table
            columns={columns}
            data={subscriptions}
            onRowClick={(row) => router.push(`/admin/subscriptions/${row.id}`)}
          />
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={Math.ceil(total / 10) || 1}
        onPageChange={setPage}
        currentItemsCount={subscriptions.length}
        totalItems={total}
        itemName="subscriptions"
      />
    </div>
  );
};

export default AdminSubscriptionsListView;
