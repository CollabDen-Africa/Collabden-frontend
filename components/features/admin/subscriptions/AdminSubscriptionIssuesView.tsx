"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Table, Column } from "@/components/ui/Table";
import { SubscriptionsSubNav } from "./SubscriptionsSubNav";
import { useAdminSubscriptionIssues } from "@/hooks/admin/useAdminSubscriptionIssues";
import {
  HiOutlineExclamationCircle,
  HiOutlineRefresh,
  HiOutlineExternalLink,
  HiOutlineCheckCircle,
} from "react-icons/hi";

export const AdminSubscriptionIssuesView: React.FC = () => {
  const router = useRouter();
  const {
    issues,
    failedPayments,
    isLoading,
    isActionLoading,
    handleRetryPayment,
    handleSaveNote,
  } = useAdminSubscriptionIssues();

  const [notes, setNotes] = useState<Record<string, string>>({});
  const [savedNotesMessage, setSavedNotesMessage] = useState<string | null>(null);

  const breadcrumbItems = [
    { label: "Admin Portal", href: "/admin/dashboard" },
    { label: "Subscriptions", href: "/admin/subscriptions" },
    { label: "Subscription Issues" },
  ];

  const handleNoteChange = (id: string, text: string) => {
    setNotes((prev) => ({ ...prev, [id]: text }));
  };

  const submitNote = async (id: string) => {
    const text = notes[id];
    if (!text?.trim()) return;
    const success = await handleSaveNote(id, text.trim());
    if (success) {
      setSavedNotesMessage(`Investigation note saved for ticket ${id}`);
      setTimeout(() => setSavedNotesMessage(null), 3000);
    }
  };

  const failedColumns: Column<any>[] = [
    {
      key: "subscriptionId",
      label: "SUBSCRIPTION ID",
      render: (row) => <span className="font-mono text-xs font-bold text-[#73BF44]">{row.subscriptionId}</span>,
    },
    {
      key: "user",
      label: "USER",
      render: (row) => <span className="text-xs font-semibold text-white">{row.user}</span>,
    },
    {
      key: "plan",
      label: "PLAN",
      render: (row) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#6495ED]/10 text-[#6495ED] border border-[#6495ED]/20">
          {row.plan}
        </span>
      ),
    },
    {
      key: "failedAmount",
      label: "FAILED AMOUNT",
      render: (row) => (
        <span className="text-xs font-bold text-[#FF0404] font-mono">
          ₦{row.failedAmount?.toLocaleString()}
        </span>
      ),
    },
    {
      key: "failureReason",
      label: "FAILURE REASON",
      render: (row) => <span className="text-xs text-[#AEB2B4]">{row.failureReason}</span>,
    },
    {
      key: "retryAttempts",
      label: "RETRY ATTEMPTS",
      render: (row) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FBBC04]/10 text-[#FBBC04] border border-[#FBBC04]/20">
          {row.retryAttempts} Attempts
        </span>
      ),
    },
    {
      key: "lastAttempt",
      label: "LAST ATTEMPT",
      render: (row) => <span className="text-xs text-[#AEB2B4]">{row.lastAttempt}</span>,
    },
    {
      key: "actions",
      label: "ACTIONS",
      render: (row) => (
        <button
          onClick={() => handleRetryPayment(row.id)}
          disabled={isActionLoading}
          className="px-3 py-1 rounded-lg bg-[#73BF44]/10 hover:bg-[#73BF44]/20 text-[#73BF44] border border-[#73BF44]/20 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
        >
          <HiOutlineRefresh size={12} /> Retry
        </button>
      ),
    },
  ];

  return (
    <div className="w-full flex flex-col gap-6 pb-12 animate-in fade-in duration-300">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight font-sans">Subscription Issues</h1>
        <p className="text-sm text-[#AEB2B4] mt-1">
          Review & resolve billing, payment, and account access issues reported by users across the platform.
        </p>
      </div>

      {/* Reusable Sub-Nav */}
      <SubscriptionsSubNav />

      {/* Saved Note Toast */}
      {savedNotesMessage && (
        <div className="p-4 rounded-xl bg-[#73BF44]/10 border border-[#73BF44]/20 text-[#73BF44] text-xs font-bold flex items-center gap-2">
          <HiOutlineCheckCircle size={18} /> {savedNotesMessage}
        </div>
      )}

      {/* Reported Issues Section */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider font-sans">Open & Investigating User Issues</h2>

        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-[#73BF44] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#AEB2B4] mt-3">Loading reported issues...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {issues.map((iss) => (
              <div key={iss.id} className="p-6 rounded-2xl bg-card-bg-alt/30 border border-white/10 flex flex-col gap-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#73BF44]/10 border border-[#73BF44]/20 flex items-center justify-center font-bold text-[#73BF44]">
                      {iss.userName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white">{iss.userName}</h3>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#6495ED]/10 text-[#6495ED] border border-[#6495ED]/20">
                          {iss.plan}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          iss.status === "Open" ? "bg-[#FF0404]/10 text-[#FF0404] border border-[#FF0404]/20" : "bg-[#FBBC04]/10 text-[#FBBC04] border border-[#FBBC04]/20"
                        }`}>
                          {iss.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#AEB2B4]">{iss.userEmail} &middot; {iss.subscriptionId}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => router.push(`/admin/subscriptions/${iss.subscriptionId.toLowerCase()}`)}
                      className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <HiOutlineExternalLink size={14} /> View Subscription
                    </button>
                    <button
                      onClick={() => alert(`Update status for issue ${iss.id}`)}
                      className="px-3 py-1.5 rounded-xl bg-[#73BF44] text-[#505050] text-xs font-bold hover:brightness-110 cursor-pointer"
                    >
                      Update Status
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-xs font-bold text-white mb-1">{iss.issueTitle}</h4>
                  <p className="text-xs text-[#AEB2B4] leading-relaxed">{iss.issueDescription}</p>
                </div>

                {/* Admin Note Box */}
                <div className="p-4 rounded-xl bg-white/2 border border-white/5 space-y-2">
                  <span className="text-[11px] font-bold text-[#AEB2B4] uppercase tracking-wider">Internal Investigation Note</span>
                  <textarea
                    rows={2}
                    placeholder="Enter investigation notes (e.g. Flutterwave transaction logs verified)..."
                    value={notes[iss.id] ?? (iss.investigationNote || "")}
                    onChange={(e) => handleNoteChange(iss.id, e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-[#AEB2B4]/40 focus:outline-none focus:border-[#73BF44] transition-colors resize-none"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() => submitNote(iss.id)}
                      disabled={isActionLoading}
                      className="px-3 py-1.5 rounded-xl bg-[#73BF44]/20 text-[#73BF44] border border-[#73BF44]/30 text-xs font-bold hover:bg-[#73BF44]/30 transition-colors cursor-pointer"
                    >
                      Save Note
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Failed & Retrying Payments Section */}
      <div className="p-6 rounded-2xl bg-card-bg-alt/30 border border-white/10 space-y-4 mt-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-sans flex items-center gap-2">
              <HiOutlineExclamationCircle className="text-[#FF0404]" size={18} /> Failed & Retrying Payments
            </h3>
            <p className="text-xs text-[#AEB2B4] mt-0.5">Automated billing retries and payment gateway failures requiring admin attention.</p>
          </div>
        </div>

        <Table columns={failedColumns} data={failedPayments} />
      </div>
    </div>
  );
};

export default AdminSubscriptionIssuesView;
