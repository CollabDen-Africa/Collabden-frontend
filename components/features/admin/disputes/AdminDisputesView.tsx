"use client";

import React, { useState, useCallback } from "react";
import {
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineFlag,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import { HiOutlineChevronDown } from "react-icons/hi2";
import { useDisputes } from "@/hooks/admin/useDisputes";
import { Table } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { ExportCSVButton } from "@/components/ui/ExportCSVButton";
import Avatar from "@/components/ui/Avatar";
import { useDebounce } from "@/hooks/useDebounce";
import {
  DISPUTE_TYPE_LABELS,
  DISPUTE_TYPE_COLORS,
  DISPUTE_STATUS_LABELS,
  DISPUTE_STATUS_COLORS,
  DISPUTE_STATUS_DOT,
} from "@/constants/disputes";
import type { Dispute, DisputeType, DisputeStatus } from "@/services/admin/disputes.service";

// ─── Sub-components ───────────────────────────────────────────────────────────

const TypeBadge = ({ type }: { type: DisputeType }) => (
  <span
    className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${DISPUTE_TYPE_COLORS[type]}`}
  >
    {DISPUTE_TYPE_LABELS[type]}
  </span>
);

const StatusBadge = ({ status }: { status: DisputeStatus }) => (
  <span className={`flex items-center gap-1.5 text-sm font-semibold ${DISPUTE_STATUS_COLORS[status]}`}>
    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${DISPUTE_STATUS_DOT[status]}`} />
    {DISPUTE_STATUS_LABELS[status]}
  </span>
);

const UserCell = ({ user }: { user: Dispute["complainant"] }) => (
  <div className="flex items-center gap-2.5">
    <Avatar name={user.name} className="w-8 h-8 text-xs shrink-0" />
    <span className="text-sm text-white font-medium whitespace-nowrap">{user.name}</span>
  </div>
);

interface FilterSelectProps {
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
}

const FilterSelect = ({ id, value, onChange, options, placeholder }: FilterSelectProps) => (
  <div className="relative">
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={placeholder}
      className="appearance-none bg-white/5 border border-white/10 rounded-xl pl-3.5 pr-8 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-white/20 transition-all cursor-pointer hover:bg-white/8 min-w-37"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} className="bg-[#0d0f10]">
          {o.label}
        </option>
      ))}
    </select>
    <HiOutlineChevronDown
      size={14}
      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
    />
  </div>
);

import { useRouter } from "next/navigation";

export const AdminDisputesView: React.FC = () => {
  const router = useRouter();
  const [rawSearch, setRawSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [assignedFilter, setAssignedFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const limit = 10;

  const searchTerm = useDebounce(rawSearch, 350);

  const { data, isLoading, isError } = useDisputes({
    page,
    limit,
    search: searchTerm || undefined,
    status: statusFilter !== "ALL" ? statusFilter : undefined,
    type: typeFilter !== "ALL" ? typeFilter : undefined,
    assignedAdmin: assignedFilter !== "ALL" ? assignedFilter : undefined,
  });

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setRawSearch(e.target.value);
      setPage(1);
    },
    []
  );

  const handleFilterChange = useCallback(
    (setter: (v: string) => void) => (v: string) => {
      setter(v);
      setPage(1);
    },
    []
  );

  const stats = data?.stats ?? {
    total: 0,
    open: 0,
    underReview: 0,
    awaitingResponse: 0,
    resolved: 0,
  };

  const statCards = [
    {
      label: "Total Disputes",
      value: stats.total.toLocaleString(),
      accent: "bg-white/30",
    },
    {
      label: "Open",
      value: stats.open.toLocaleString(),
      accent: "bg-red-500",
    },
    {
      label: "Under Review",
      value: stats.underReview.toLocaleString(),
      accent: "bg-yellow-400",
    },
    {
      label: "Awaiting Response",
      value: stats.awaitingResponse.toLocaleString(),
      accent: "bg-blue-400",
    },
    {
      label: "Resolved / Closed",
      value: stats.resolved.toLocaleString(),
      accent: "bg-[#72c043]",
    },
  ];

  const activeFilterCount = [statusFilter, typeFilter, assignedFilter].filter(
    (f) => f !== "ALL"
  ).length;

  const exportData = (data?.disputes ?? []).map((d) => ({
    disputeId: d.disputeCode,
    type: DISPUTE_TYPE_LABELS[d.type],
    status: DISPUTE_STATUS_LABELS[d.status],
    complainant: d.complainant.name,
    respondent: d.respondent.name,
    project: d.project ?? "—",
    reference: d.reference,
    assignedAdmin: d.assignedAdmin ?? "Unassigned",
    dateSubmitted: new Date(d.createdAt).toLocaleDateString("en-US"),
  }));

  return (
    <div className="w-full flex flex-col gap-8 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Dispute Resolution Management
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Review, investigate, and resolve user disputes across all platform activities.
          </p>
        </div>
        <ExportCSVButton
          data={exportData}
          filename="collabden-disputes.csv"
          headers={[
            { label: "Dispute ID", key: "disputeId" },
            { label: "Type", key: "type" },
            { label: "Status", key: "status" },
            { label: "Complainant", key: "complainant" },
            { label: "Respondent", key: "respondent" },
            { label: "Project", key: "project" },
            { label: "Reference", key: "reference" },
            { label: "Assigned Admin", key: "assignedAdmin" },
            { label: "Date Submitted", key: "dateSubmitted" },
          ]}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white/2 border border-white/5 rounded-2xl p-5 flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-bold text-white tracking-tight">
                {isLoading ? "—" : card.value}
              </span>
              <span className="text-white/40 text-xs font-medium uppercase tracking-wider">
                {card.label}
              </span>
            </div>
            <div className={`h-1 w-8 rounded-full ${card.accent}`} />
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <HiOutlineSearch
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
            size={16}
          />
          <input
            id="disputes-search"
            type="text"
            placeholder="Search by ID, user, project, or transaction..."
            value={rawSearch}
            onChange={handleSearch}
            className="w-full bg-white/2 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/20 focus:bg-white/4 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Filter indicator */}
          <div className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/2 text-white/60 text-sm font-medium">
            <HiOutlineFilter size={15} />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-[#72c043] text-[#0d0f10] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </div>

          {/* Dispute Status */}
          <FilterSelect
            id="filter-status"
            value={statusFilter}
            onChange={handleFilterChange(setStatusFilter)}
            placeholder="Dispute Status"
            options={[
              { label: "Dispute Status", value: "ALL" },
              { label: "Open", value: "OPEN" },
              { label: "Under Review", value: "UNDER_REVIEW" },
              { label: "Awaiting Response", value: "AWAITING_RESPONSE" },
              { label: "Resolved", value: "RESOLVED" },
              { label: "Closed", value: "CLOSED" },
            ]}
          />

          {/* Dispute Type */}
          <FilterSelect
            id="filter-type"
            value={typeFilter}
            onChange={handleFilterChange(setTypeFilter)}
            placeholder="Dispute Type"
            options={[
              { label: "Dispute Type", value: "ALL" },
              { label: "Payment", value: "PAYMENT" },
              { label: "Escrow Milestone", value: "ESCROW_MILESTONE" },
              { label: "Agreement", value: "AGREEMENT" },
              { label: "Project Collaboration", value: "PROJECT_COLLABORATION" },
              { label: "User Conduct", value: "USER_CONDUCT" },
            ]}
          />

          {/* Assigned Admin */}
          <FilterSelect
            id="filter-assigned"
            value={assignedFilter}
            onChange={handleFilterChange(setAssignedFilter)}
            placeholder="Assigned Admin"
            options={[
              { label: "Assigned Admin", value: "ALL" },
              { label: "Unassigned", value: "UNASSIGNED" },
              { label: "Super Admin", value: "Super Admin" },
            ]}
          />
        </div>
      </div>

      {/* Error State */}
      {isError && (
        <div className="flex items-center gap-3 px-5 py-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          <HiOutlineExclamationCircle size={18} className="shrink-0" />
          <span>Failed to load disputes. Please try refreshing the page.</span>
        </div>
      )}

      {/* Table */}
      <Table<Dispute>
        columns={[
          {
            key: "disputeCode",
            label: "DISPUTE ID",
            render: (d) => (
              <div className="flex items-center gap-2">
                <HiOutlineFlag size={14} className="text-white/30 shrink-0" />
                <span className="text-sm font-bold text-white font-mono">{d.disputeCode}</span>
              </div>
            ),
          },
          {
            key: "type",
            label: "TYPE",
            render: (d) => <TypeBadge type={d.type} />,
          },
          {
            key: "complainant",
            label: "COMPLAINANT",
            render: (d) => <UserCell user={d.complainant} />,
          },
          {
            key: "respondent",
            label: "RESPONDENT",
            render: (d) => <UserCell user={d.respondent} />,
          },
          {
            key: "project",
            label: "PROJECT",
            render: (d) =>
              d.project ? (
                <span className="text-sm text-white/70">{d.project}</span>
              ) : (
                <span className="text-sm text-white/25">—</span>
              ),
          },
          {
            key: "reference",
            label: "REFERENCE",
            render: (d) => (
              <span className="text-sm font-medium text-[#72c043] font-mono">{d.reference}</span>
            ),
          },
          {
            key: "status",
            label: "STATUS",
            render: (d) => <StatusBadge status={d.status} />,
          },
          {
            key: "createdAt",
            label: "DATE SUBMITTED",
            render: (d) => (
              <span className="text-sm text-white/40 whitespace-nowrap">
                {new Date(d.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            ),
          },
        ]}
        data={data?.disputes ?? []}
        onRowClick={(d) => router.push(`/admin/disputes/${d.id}`)}
        isLoading={isLoading}
        loadingState={
          <div className="py-16 flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-[#72c043] border-t-transparent rounded-full animate-spin" />
            <span className="text-white/40 text-sm">Loading disputes...</span>
          </div>
        }
        emptyState={
          <div className="py-16 flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
              <HiOutlineFlag size={20} className="text-white/30" />
            </div>
            <div>
              <p className="text-white/60 font-medium">No disputes found</p>
              <p className="text-white/25 text-sm mt-0.5">
                {rawSearch || activeFilterCount > 0
                  ? "Try adjusting your search or filters."
                  : "No disputes have been submitted yet."}
              </p>
            </div>
          </div>
        }
      />

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
        currentItemsCount={data?.disputes?.length ?? 0}
        totalItems={data?.total ?? 0}
        itemName="disputes"
      />
    </div>
  );
};

export default AdminDisputesView;
