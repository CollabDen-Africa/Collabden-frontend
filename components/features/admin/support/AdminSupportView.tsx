"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineSearch, HiOutlineExclamationCircle } from "react-icons/hi";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { StatCard } from "@/components/features/admin/shared/StatCard";
import { Table, Column } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { ExportCSVButton } from "@/components/ui/ExportCSVButton";
import EmptyState from "@/components/ui/EmptyState";
import { useAdminSupport } from "@/hooks/admin/useAdminSupport";
import { SupportTicketItem } from "@/services/admin/support.service";

const ITEMS_PER_PAGE = 10;

const STATUS_STYLES: Record<string, string> = {
  Open: "bg-accent-red/10 text-accent-red border border-accent-red/20",
  "In Progress": "bg-accent-yellow/10 text-accent-yellow border border-accent-yellow/20",
  Resolved: "bg-primary-green/10 text-primary-green border border-primary-green/20",
  Closed: "bg-white/5 text-text-muted border border-white/10",
};

const PRIORITY_STYLES: Record<string, string> = {
  Critical: "bg-accent-red/10 text-accent-red border border-accent-red/20",
  High: "bg-accent-yellow/10 text-accent-yellow border border-accent-yellow/20",
  Medium: "bg-secondary-blue/10 text-secondary-blue border border-secondary-blue/20",
  Low: "bg-white/5 text-text-muted border border-white/10",
};

export const AdminSupportView: React.FC = () => {
  const router = useRouter();
  const {
    tickets,
    stats,
    isLoading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    categoryFilter,
    setCategoryFilter,
    page,
    setPage,
  } = useAdminSupport();

  const [dateFilter] = useState("ALL");

  const breadcrumbItems = [
    { label: "Admin Portal", href: "/admin/dashboard" },
    { label: "Support Management" },
  ];

  const statCards = [
    { label: "Total Tickets", value: stats.totalTickets, color: "bg-primary-green" },
    { label: "Open", value: stats.openTickets, color: "bg-accent-red", isRedAlert: true },
    { label: "In Progress", value: stats.inProgressTickets, color: "bg-accent-yellow" },
    { label: "Resolved", value: stats.resolvedTickets, color: "bg-primary-green" },
    { label: "Avg Response", value: stats.avgResponseTime, color: "bg-secondary-blue" },
    { label: "SLA Breaches", value: stats.slaBreaches, color: "bg-accent-red", isRedAlert: true },
  ];

  const criticalCount = tickets.filter((t) => t.priority === "Critical" && t.status === "Open").length;

  const paginatedTickets = tickets.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const columns: Column<SupportTicketItem>[] = [
    {
      key: "ticketId",
      label: "TICKET ID",
      render: (row) => <span className="font-mono text-xs font-bold text-primary-green">{row.ticketId}</span>,
    },
    {
      key: "userName",
      label: "USER",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-white">{row.userName}</span>
          <span className="text-xs text-text-muted">{row.userEmail}</span>
        </div>
      ),
    },
    {
      key: "category",
      label: "CATEGORY",
      render: (row) => (
        <span className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-white/80">
          {row.category}
        </span>
      ),
    },
    {
      key: "subject",
      label: "SUBJECT",
      render: (row) => (
        <span className="text-xs text-white/80 line-clamp-1 max-w-60">{row.subject}</span>
      ),
    },
    {
      key: "priority",
      label: "PRIORITY",
      render: (row) => (
        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${PRIORITY_STYLES[row.priority] || ""}`}>
          {row.priority}
        </span>
      ),
    },
    {
      key: "status",
      label: "STATUS",
      render: (row) => (
        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[row.status] || ""}`}>
          {row.status}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "DATE",
      render: (row) => (
        <span className="text-xs text-text-muted">
          {new Date(row.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </span>
      ),
    },
  ];

  const statusFilters = [
    { value: "ALL", label: "All" },
    { value: "Open", label: "Open" },
    { value: "In Progress", label: "In Progress" },
    { value: "Resolved", label: "Resolved" },
    { value: "Closed", label: "Closed" },
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Support Management</h1>
          <p className="text-xs text-text-muted mt-1">
            Manage support tickets, assign requests, and track resolution across all categories.
          </p>
        </div>
        <ExportCSVButton
          data={tickets}
          filename="support-tickets"
          headers={[
            { label: "Ticket ID", key: "ticketId" },
            { label: "User", key: "userName" },
            { label: "Category", key: "category" },
            { label: "Subject", key: "subject" },
            { label: "Priority", key: "priority" },
            { label: "Status", key: "status" },
            { label: "Date", key: "createdAt" },
          ]}
        />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            color={stat.color}
            isRedAlert={stat.isRedAlert}
          />
        ))}
      </div>

      {/* Critical Alert Banner */}
      {criticalCount > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-accent-yellow/10 border border-accent-yellow/20">
          <HiOutlineExclamationCircle className="text-accent-yellow shrink-0" size={20} />
          <p className="text-xs text-accent-yellow font-semibold">
            {criticalCount} critical ticket{criticalCount > 1 ? "s" : ""} awaiting immediate action —{" "}
            <span className="font-mono">SLA response time: 2h</span>. Click below to review and assign.
          </p>
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative w-full sm:w-72">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
            <input
              type="text"
              placeholder="Search tickets by ID, user, or subject..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-primary-green/40 transition-colors"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap gap-2">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/80 focus:outline-none focus:border-primary-green/40 transition-colors cursor-pointer appearance-none"
            >
              <option value="ALL" className="bg-[#1a1d1f]">Ticket Status</option>
              <option value="Open" className="bg-[#1a1d1f]">Open</option>
              <option value="In Progress" className="bg-[#1a1d1f]">In Progress</option>
              <option value="Resolved" className="bg-[#1a1d1f]">Resolved</option>
              <option value="Closed" className="bg-[#1a1d1f]">Closed</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
              className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/80 focus:outline-none focus:border-primary-green/40 transition-colors cursor-pointer appearance-none"
            >
              <option value="ALL" className="bg-[#1a1d1f]">Category</option>
              <option value="Payment Issue" className="bg-[#1a1d1f]">Payment Issue</option>
              <option value="Escrow Dispute" className="bg-[#1a1d1f]">Escrow Dispute</option>
              <option value="Account Access" className="bg-[#1a1d1f]">Account Access</option>
              <option value="Verification" className="bg-[#1a1d1f]">Verification</option>
              <option value="Platform Bug" className="bg-[#1a1d1f]">Platform Bug</option>
              <option value="General Inquiry" className="bg-[#1a1d1f]">General Inquiry</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => { setPriorityFilter(e.target.value); setPage(1); }}
              className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/80 focus:outline-none focus:border-primary-green/40 transition-colors cursor-pointer appearance-none"
            >
              <option value="ALL" className="bg-[#1a1d1f]">Assignee/Priority</option>
              <option value="Critical" className="bg-[#1a1d1f]">Critical</option>
              <option value="High" className="bg-[#1a1d1f]">High</option>
              <option value="Medium" className="bg-[#1a1d1f]">Medium</option>
              <option value="Low" className="bg-[#1a1d1f]">Low</option>
            </select>
            <select
              value={dateFilter}
              className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/80 focus:outline-none focus:border-primary-green/40 transition-colors cursor-pointer appearance-none"
              disabled
            >
              <option value="ALL" className="bg-[#1a1d1f]">Date Combined</option>
            </select>
          </div>
        </div>

        {/* Status Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => {
                setStatusFilter(filter.value);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                statusFilter === filter.value
                  ? "bg-primary-green text-text-main border-primary-green"
                  : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-card-bg-alt/20 rounded-2xl border border-white/5 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-primary-green border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-text-muted mt-3">Loading tickets...</p>
          </div>
        ) : paginatedTickets.length === 0 ? (
          <EmptyState
            title="No tickets found"
            description="No support tickets match your current filters."
            icon={<HiOutlineExclamationCircle size={40} />}
          />
        ) : (
          <Table
            columns={columns}
            data={paginatedTickets}
            onRowClick={(row) => router.push(`/admin/support/${row.id}`)}
          />
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={Math.ceil(tickets.length / ITEMS_PER_PAGE) || 1}
        onPageChange={setPage}
        currentItemsCount={paginatedTickets.length}
        totalItems={tickets.length}
        itemName="tickets"
      />
    </div>
  );
};

export default AdminSupportView;
