"use client";

import React, { useState } from "react";
import { useAdminVerification } from "@/hooks/admin/useAdminVerification";
import { StatCard } from "@/components/features/admin/shared/StatCard";
import { VerificationTable } from "./VerificationTable";
import { Tabs } from "@/components/ui/Tabs";
import { Pagination } from "@/components/ui/Pagination";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ExportCSVButton } from "@/components/ui/ExportCSVButton";
import {
  HiOutlineShieldCheck,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineSearch,
  HiOutlineDocumentSearch,
  HiOutlineExclamation,
} from "react-icons/hi";

export const AdminVerifyView: React.FC = () => {
  const {
    requests,
    auditLogs,
    pagination,
    stats,
    isLoading,
    isSubmitting,
    error,
    filters,
    setFilters,
    fetchAuditLogs,
    submitDecision,
  } = useAdminVerification();

  const [activeTab, setActiveTab] = useState<string>("Verification Requests");
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [rejectError, setRejectError] = useState<string | null>(null);
  const [approveConfirmId, setApproveConfirmId] = useState<string | null>(null);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "Audit History") {
      fetchAuditLogs();
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleStatusFilter = (status: string) => {
    setFilters((prev) => ({ ...prev, status, page: 1 }));
  };

  const handleApproveClick = (id: string) => {
    setApproveConfirmId(id);
  };

  const confirmApprove = async () => {
    if (!approveConfirmId) return;
    try {
      await submitDecision(approveConfirmId, { status: "APPROVED" });
      setApproveConfirmId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectClick = (id: string) => {
    setRejectId(id);
    setRejectionReason("");
    setRejectError(null);
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (!rejectId) return;
    if (!rejectionReason.trim()) {
      setRejectError("A rejection reason is required.");
      return;
    }
    try {
      await submitDecision(rejectId, {
        status: "REJECTED",
        rejectionReason: rejectionReason.trim(),
      });
      setShowRejectModal(false);
      setRejectId(null);
    } catch (err: any) {
      setRejectError(err?.message || "Failed to reject request.");
    }
  };

  return (
    <div className="w-full flex flex-col gap-8 pb-12 animate-in fade-in duration-300">
      {/* Breadcrumbs & Page Header */}
      <div className="flex flex-col gap-2">
        <Breadcrumbs
          items={[
            { label: "Admin Portal", href: "/admin/dashboard" },
            { label: "Identity Verification" },
          ]}
        />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-sans flex items-center gap-3">
              <HiOutlineShieldCheck className="text-primary-green" size={32} />
              Identity Verification Hub
            </h1>
            <p className="text-text-muted text-sm mt-1">
              Audit user KYC identity documents, review verification status, and approve or reject submissions.
            </p>
          </div>
          <ExportCSVButton
            data={requests}
            filename="verification-requests.csv"
            headers={[
              { label: "Request ID", key: "id" },
              { label: "User Name", key: "userName" },
              { label: "User Email", key: "userEmail" },
              { label: "Document Type", key: "documentType" },
              { label: "Status", key: "status" },
              { label: "Submitted Date", key: "submittedAt" },
            ]}
          />
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Pending Review"
          value={stats.pending}
          subtitle="Awaiting admin action"
          icon={<HiOutlineClock size={22} />}
          badge="Action Needed"
          isLoading={isLoading}
        />
        <StatCard
          label="Approved Accounts"
          value={stats.approved}
          subtitle="Verified users"
          icon={<HiOutlineCheckCircle size={22} />}
          isLoading={isLoading}
        />
        <StatCard
          label="Rejected Applications"
          value={stats.rejected}
          subtitle="Declined documents"
          icon={<HiOutlineXCircle size={22} />}
          isRedAlert={stats.rejected > 0}
          isLoading={isLoading}
        />
        <StatCard
          label="Total Submissions"
          value={stats.total}
          subtitle="All-time request volume"
          icon={<HiOutlineDocumentSearch size={22} />}
          isLoading={isLoading}
        />
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-accent-red/10 border border-accent-red/20 text-accent-red text-sm flex items-center gap-3">
          <HiOutlineExclamation size={20} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Workspace Card */}
      <div className="w-full rounded-2xl bg-card-bg-alt/30 border border-white/10 shadow-xl overflow-hidden flex flex-col">
        {/* Navigation Tabs */}
        <Tabs
          tabs={["Verification Requests", "Audit History"]}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {activeTab === "Verification Requests" ? (
          <>
            {/* Filter & Search Bar */}
            <div className="p-6 border-b border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 bg-white/5">
              {/* Search */}
              <div className="relative w-full md:w-80">
                <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input
                  type="text"
                  placeholder="Search user, ID, or email..."
                  value={filters.search || ""}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-text-muted/40 focus:outline-none focus:border-primary-green transition-colors"
                />
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto custom-scrollbar pb-1 md:pb-0">
                {["All", "PENDING", "APPROVED", "REJECTED"].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusFilter(st)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      (filters.status || "All") === st
                        ? "bg-primary-green text-text-main shadow-md"
                        : "bg-white/5 text-text-muted hover:bg-white/10 hover:text-white border border-white/5"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="p-6">
              <VerificationTable
                requests={requests}
                isLoading={isLoading}
                onApprove={handleApproveClick}
                onReject={handleRejectClick}
              />
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              totalItems={pagination.total}
              currentItemsCount={requests.length}
              itemName="requests"
              onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
            />
          </>
        ) : (
          /* Audit History Tab */
          <div className="p-6">
            <h3 className="text-lg font-bold text-white mb-4 font-sans">Verification Administrative Audit Trail</h3>
            {!auditLogs.length ? (
              <div className="py-12 text-center text-text-muted text-sm">
                No verification audit history records found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm text-white/80">
                  <thead>
                    <tr className="border-b border-white/10 text-text-muted text-xs uppercase tracking-wider font-semibold">
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Action</th>
                      <th className="py-3 px-4">Admin</th>
                      <th className="py-3 px-4">Target User</th>
                      <th className="py-3 px-4">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {auditLogs.map((log: any, idx: number) => (
                      <tr key={log.id || idx} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4 text-text-muted text-xs">
                          {new Date(log.createdAt || Date.now()).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 font-semibold text-primary-green">{log.action || log.event}</td>
                        <td className="py-3 px-4 text-white font-medium">{log.adminName || log.adminEmail || "Admin"}</td>
                        <td className="py-3 px-4 text-white/70">{log.targetUser || log.userEmail || "N/A"}</td>
                        <td className="py-3 px-4 text-text-muted text-xs">{log.details || log.reason || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Approve Confirmation Modal */}
      {approveConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#141719] border border-white/10 p-6 shadow-2xl flex flex-col gap-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2 font-sans">
              <HiOutlineCheckCircle className="text-primary-green" size={24} />
              Approve Verification
            </h3>
            <p className="text-text-muted text-sm">
              Are you sure you want to approve this user&apos;s identity verification request? This will mark their profile as verified.
            </p>
            <div className="flex items-center justify-end gap-3 mt-2">
              <button
                onClick={() => setApproveConfirmId(null)}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-sm font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmApprove}
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-primary-green hover:brightness-110 text-text-main text-sm font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? "Approving..." : "Confirm Approval"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal with Mandatory Reason */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#141719] border border-white/10 p-6 shadow-2xl flex flex-col gap-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2 font-sans">
              <HiOutlineXCircle className="text-accent-red" size={24} />
              Reject Verification Application
            </h3>
            <p className="text-text-muted text-sm">
              Please state the specific reason for rejecting this verification request. This reason will be communicated to the user.
            </p>

            <textarea
              rows={3}
              placeholder="Enter detailed rejection reason (e.g. Document image blurry or expired ID)..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-text-muted/40 focus:outline-none focus:border-accent-red transition-colors"
            />

            {rejectError && <span className="text-xs text-accent-red font-medium">{rejectError}</span>}

            <div className="flex items-center justify-end gap-3 mt-2">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectId(null);
                }}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-sm font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-accent-red hover:bg-accent-red/90 text-white text-sm font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? "Rejecting..." : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVerifyView;
