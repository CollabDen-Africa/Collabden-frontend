import React, { useState } from "react";
import { FiShield, FiSearch } from "react-icons/fi";
import { Table, Column } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { AuditHistoryItem } from "@/services/admin/settings.service";

interface ChangeHistoryTabProps {
  auditHistory?: AuditHistoryItem[];
  auditTotal?: number;
  auditPage?: number;
  auditLimit?: number;
  auditSearch?: string;
  auditCategory?: string;
  onPageChange?: (page: number) => void;
  onSearchChange?: (search: string) => void;
  onCategoryChange?: (category: string) => void;
  isLoading?: boolean;
}

const FILTERS = [
  "All Sections",
  "General",
  "User & Account Settings",
  "Marketplace Settings",
  "Notification Settings",
  "System Announcements",
  "Account Restriction Settings",
];

export default function ChangeHistoryTab({
  auditHistory = [],
  auditTotal = 0,
  auditPage = 1,
  auditLimit = 10,
  auditSearch = "",
  auditCategory = "",
  onPageChange,
  onSearchChange,
  onCategoryChange,
  isLoading = false,
}: ChangeHistoryTabProps) {
  const [localFilter, setLocalFilter] = useState("All Sections");

  const currentFilter = auditCategory || localFilter;

  const handleFilterClick = (filter: string) => {
    setLocalFilter(filter);
    if (onCategoryChange) {
      onCategoryChange(filter === "All Sections" ? "" : filter);
    }
  };

  const totalPages = Math.max(1, Math.ceil(auditTotal / auditLimit));

  const columns: Column<AuditHistoryItem>[] = [
    {
      key: "id",
      label: "#",
      render: (_item, idx = 0) => (
        <span className="text-xs font-mono text-white/40">
          {(auditPage - 1) * auditLimit + (idx as number) + 1}
        </span>
      ),
    },
    {
      key: "category",
      label: "Section",
      render: (item) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-primary-green/10 text-primary-green border border-primary-green/20">
          {item.category || item.section || "General"}
        </span>
      ),
    },
    {
      key: "settingName",
      label: "Setting Changed",
      render: (item) => (
        <span className="text-xs font-semibold text-white">
          {item.settingName || item.setting || "Configuration"}
        </span>
      ),
    },
    {
      key: "previousValue",
      label: "Previous Value",
      render: (item) => (
        <span className="text-xs font-mono text-white/40 line-through">
          {String(item.previousValue ?? item.prevValue ?? "N/A")}
        </span>
      ),
    },
    {
      key: "newValue",
      label: "New Value",
      render: (item) => (
        <span className="text-xs font-mono text-primary-green font-medium">
          {String(item.newValue ?? "N/A")}
        </span>
      ),
    },
    {
      key: "admin",
      label: "Modified By",
      render: (item) => (
        <div className="flex flex-col">
          <span className="text-xs font-medium text-white">
            {item.admin?.email || item.adminEmail || "Administrator"}
          </span>
          {item.admin?.role && (
            <span className="text-[10px] text-white/40">{item.admin.role}</span>
          )}
        </div>
      ),
    },
    {
      key: "performedAt",
      label: "Date & Time",
      render: (item) => (
        <span className="text-xs text-white/60">
          {item.date ||
            (item.performedAt
              ? new Date(item.performedAt).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })
              : "Recent")}
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col w-full gap-4">
      {/* Header Section */}
      <div className="flex flex-row justify-between items-center w-full">
        <div className="flex items-center gap-2.5">
          <div className="w-1 h-4 bg-primary-blue rounded-full" />
          <h2 className="font-bold text-sm text-white tracking-tight">
            Platform Settings Audit History
          </h2>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-blue/10 border border-secondary-blue/20 rounded-lg">
          <FiShield className="w-3 h-3 text-secondary-blue" />
          <span className="font-semibold text-[11px] text-secondary-blue">
            Immutable · Read-Only
          </span>
        </div>
      </div>

      {/* Controls: Search + Section Filter Pills */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex flex-row items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {FILTERS.map((filter) => {
            const isSelected =
              filter === "All Sections"
                ? !currentFilter || currentFilter === "All Sections"
                : currentFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => handleFilterClick(filter)}
                className={`px-3 py-1 text-xs rounded-full whitespace-nowrap transition-colors border ${
                  isSelected
                    ? "bg-primary-green/10 border-primary-green/30 text-primary-green font-bold"
                    : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* Search Box */}
        {onSearchChange && (
          <div className="relative w-full sm:w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search setting or admin..."
              value={auditSearch}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-primary-green transition-colors"
            />
          </div>
        )}
      </div>

      {/* Reusable Data Table */}
      <Table
        columns={columns}
        data={auditHistory}
        isLoading={isLoading}
      />

      {/* Reusable Pagination */}
      {totalPages > 1 && onPageChange && (
        <Pagination
          currentPage={auditPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          totalItems={auditTotal}
          currentItemsCount={auditHistory.length}
          itemName="audit records"
        />
      )}
    </div>
  );
}

