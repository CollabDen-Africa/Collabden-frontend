"use client";

import React, { useState } from "react";
import { HiOutlineSearch, HiOutlineFilter } from "react-icons/hi";
import { useAdminAgreements } from "@/hooks/admin/useAdminAgreements";
import { ExportCSVButton } from "@/components/ui/ExportCSVButton";
import { StatCard } from "@/components/features/admin/shared/StatCard";
import { Pagination } from "@/components/ui/Pagination";
import { AgreementsTable, AgreementRow } from "./AgreementsTable";

export const AdminAgreementsView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { overview, isLoadingOverview, agreements, agreementsTotal, isLoadingAgreements } =
    useAdminAgreements({ page, limit, search: searchTerm || undefined });

  const rows: AgreementRow[] = Array.isArray(agreements)
    ? agreements.map((a: any) => ({
        id: a.id || a._id,
        agreementId: a.agreementId || `AGR-${a.id?.slice(-4) || '0000'}`,
        projectName: a.projectName || a.project?.title || "Untitled Agreement",
        ownerName: a.ownerName || a.owner?.displayName || "Project Owner",
        collaborators: Array.isArray(a.collaborators) ? a.collaborators : [],
        status: a.status === "DISPUTED" ? "Disputed" : a.status === "PENDING" ? "Pending Signatures" : a.status === "DRAFT" ? "Draft" : "Signed",
        dateSigned: a.signedAt ? new Date(a.signedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A",
      }))
    : [];

  return (
    <div className="w-full flex flex-col gap-8 pb-12 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight font-sans">
            Legal Agreements
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Review and manage all agreements across the platform.
          </p>
        </div>
        <ExportCSVButton
          data={rows}
          filename="legal-agreements.csv"
          headers={[
            { label: "Agreement ID", key: "agreementId" },
            { label: "Project", key: "projectName" },
            { label: "Owner", key: "ownerName" },
            { label: "Status", key: "status" },
            { label: "Date Signed", key: "dateSigned" },
          ]}
        />
      </div>

      {/* 5 KPI Stat Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          label="Total Agreements"
          value={overview?.totalAgreements?.toLocaleString() || overview?.totalCount?.toLocaleString() || "0"}
          color="bg-primary-green"
          isLoading={isLoadingOverview}
        />
        <StatCard
          label="Active"
          value={overview?.activeAgreements?.toLocaleString() || overview?.activeCount?.toLocaleString() || "0"}
          color="bg-primary-green"
          isLoading={isLoadingOverview}
        />
        <StatCard
          label="Pending Signatures"
          value={overview?.pendingSignatures?.toLocaleString() || overview?.pendingCount?.toLocaleString() || "0"}
          color="bg-primary-blue"
          isLoading={isLoadingOverview}
        />
        <StatCard
          label="Disputed"
          value={overview?.disputedAgreements?.toLocaleString() || overview?.disputedCount?.toLocaleString() || "0"}
          color="bg-accent-red"
          isRedAlert
          isLoading={isLoadingOverview}
        />
        <StatCard
          label="Draft / Pending"
          value={overview?.draftAgreements?.toLocaleString() || overview?.draftCount?.toLocaleString() || "0"}
          color="bg-accent-yellow"
          isLoading={isLoadingOverview}
        />
      </div>

      {/* Control Bar & Table Container */}
      <div className="bg-card-bg-alt/30 border border-white/5 rounded-2xl p-4 flex flex-col gap-4">
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input
              type="text"
              placeholder="Search by agreement ID, project, or owner..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-primary-green transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors shrink-0">
            <HiOutlineFilter size={16} />
            Filters
          </button>
        </div>

        {/* Real-time Data Table */}
        <AgreementsTable data={rows} isLoading={isLoadingAgreements} />

        {/* Pagination */}
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(agreementsTotal / limit) || 1}
          onPageChange={setPage}
          currentItemsCount={rows.length}
          totalItems={agreementsTotal}
          itemName="agreements"
        />
      </div>
    </div>
  );
};
