"use client";

import React, { useState } from "react";
import { HiOutlineSearch, HiOutlineExclamationCircle } from "react-icons/hi";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Pagination } from "@/components/ui/Pagination";
import EmptyState from "@/components/ui/EmptyState";
import { AgreementReportCard, AgreementReportCardItem } from "./AgreementReportCard";
import { useAdminAgreements } from "@/hooks/admin/useAdminAgreements";

export const AgreementsReportsView: React.FC = () => {
  const [activeStatus, setActiveStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { reports, reportsTotal, isLoadingReports, createNote } = useAdminAgreements();

  const reportItems: AgreementReportCardItem[] = Array.isArray(reports)
    ? reports.map((r: any) => ({
        id: r.agreementId || r.id,
        agreementId: r.agreementRef || `AGR-${r.id?.slice(-4) || '0000'}`,
        agreementTitle: r.title || r.projectName || "Agreement Project",
        reportId: r.reportId || `RPT-${r.id?.slice(-4) || '0000'}`,
        status: r.status === "RESOLVED" ? "Resolved" : r.status === "UNDER_REVIEW" ? "Under Review" : "Pending",
        reason: r.reason || "Dispute regarding agreement terms or execution.",
        reportedBy: { id: r.reportedBy?.id || "u1", name: r.reportedBy?.displayName || r.reporterName || "User" },
        usersInvolved: Array.isArray(r.usersInvolved) ? r.usersInvolved : [],
        reportedDate: r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recently",
      }))
    : [];

  const filteredItems = reportItems.filter((item) => {
    if (activeStatus !== "All" && item.status !== activeStatus) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        item.agreementTitle.toLowerCase().includes(term) ||
        item.agreementId.toLowerCase().includes(term) ||
        item.reason.toLowerCase().includes(term) ||
        item.reportedBy.name.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const handleAddNote = async (item: AgreementReportCardItem) => {
    const note = prompt(`Add internal note for report ${item.reportId}:`);
    if (note) {
      await createNote({ note, agreementId: item.id });
      alert("Internal note added successfully.");
    }
  };

  return (
    <div className="w-full flex flex-col gap-8 pb-12 animate-in fade-in duration-300">
      {/* Breadcrumb Trail */}
      <Breadcrumbs
        items={[
          { label: "Admin Portal" },
          { label: "Legal Agreements", href: "/admin/agreements" },
          { label: "Reported Issues" },
        ]}
      />

      {/* Header Bar & Status Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight font-sans">
            Reported Agreement Issues
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Review disputes and compliance reports filed against legal agreements.
          </p>
        </div>

        {/* Status Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {["All", "Pending", "Under Review", "Resolved"].map((status) => (
            <button
              key={status}
              onClick={() => {
                setActiveStatus(status);
                setPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                activeStatus === status
                  ? "bg-primary-green text-text-main border-primary-green"
                  : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input Bar & Cards Stack */}
      <div className="bg-card-bg-alt/30 border border-white/5 rounded-2xl p-4 flex flex-col gap-5">
        <div className="relative max-w-md w-full">
          <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input
            type="text"
            placeholder="Search agreement reports..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-primary-green transition-colors"
          />
        </div>

        {/* List of Report Cards */}
        <div className="flex flex-col gap-4 mt-1">
          {isLoadingReports ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-white/40 text-sm">
              <div className="w-6 h-6 border-2 border-primary-green border-t-transparent rounded-full animate-spin" />
              <span>Loading agreement reports...</span>
            </div>
          ) : filteredItems.length === 0 ? (
            <EmptyState
              icon={<HiOutlineExclamationCircle size={36} />}
              title="No Agreement Disputes Found"
              description="No reported agreement issues match your filter criteria or search parameters."
              actionLabel="Clear Filters"
              onAction={() => {
                setSearchTerm("");
                setActiveStatus("All");
              }}
            />
          ) : (
            filteredItems.map((item) => (
              <AgreementReportCard key={item.id} item={item} onAddNote={handleAddNote} />
            ))
          )}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={page}
          totalPages={Math.ceil((reportsTotal || filteredItems.length) / limit) || 1}
          onPageChange={setPage}
          currentItemsCount={filteredItems.length}
          totalItems={reportsTotal || filteredItems.length}
          itemName="reports"
        />
      </div>
    </div>
  );
};
