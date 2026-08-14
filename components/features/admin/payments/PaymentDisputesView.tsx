"use client";

import React, { useState } from "react";
import { HiOutlineSearch, HiOutlineScale } from "react-icons/hi";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import EmptyState from "@/components/ui/EmptyState";
import { useAdminPayments } from "@/hooks/admin/useAdminPayments";

export const PaymentDisputesView: React.FC = () => {
  const [activeStatus, setActiveStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const { disputes, isLoadingDisputes } = useAdminPayments({
    loadStats: false,
    loadTransactions: false,
    loadDisputes: true,
  });

  const filteredDisputes = disputes.filter((d) => {
    if (activeStatus !== "All" && d.status !== activeStatus) return false;
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      d.disputeId.toLowerCase().includes(term) ||
      d.transactionId.toLowerCase().includes(term) ||
      d.disputingUser.toLowerCase().includes(term) ||
      d.reason.toLowerCase().includes(term)
    );
  });

  return (
    <div className="w-full flex flex-col gap-8 pb-12 animate-in fade-in duration-300">
      {/* Breadcrumb Trail */}
      <Breadcrumbs
        items={[
          { label: "Admin Portal" },
          { label: "Payments", href: "/admin/payments" },
          { label: "Disputes & Chargebacks" },
        ]}
      />

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight font-sans">
            Payment Disputes & Chargebacks
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Review reported payment disputes, escrow holds, and payment gateway chargebacks.
          </p>
        </div>

        {/* Status Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {["All", "Pending Review", "Under Dispute", "Resolved", "Escalated"].map((status) => (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
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

      {/* Main Container */}
      <div className="bg-card-bg-alt/30 border border-white/5 rounded-2xl p-4 flex flex-col gap-5">
        <div className="relative max-w-md w-full">
          <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input
            type="text"
            placeholder="Search disputes by ID, user, or reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-primary-green transition-colors"
          />
        </div>

        {/* Dispute Cards List */}
        <div className="flex flex-col gap-4">
          {isLoadingDisputes ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-white/40 text-sm">
              <div className="w-6 h-6 border-2 border-primary-green border-t-transparent rounded-full animate-spin" />
              <span>Loading payment disputes...</span>
            </div>
          ) : filteredDisputes.length === 0 ? (
            <EmptyState
              icon={<HiOutlineScale size={36} />}
              title="No Payment Disputes Found"
              description="Great news! No payment disputes match your current search or filter criteria."
              actionLabel="Clear Filters"
              onAction={() => {
                setSearchTerm("");
                setActiveStatus("All");
              }}
            />
          ) : (
            filteredDisputes.map((dispute) => (
              <div
                key={dispute.id}
                className="p-5 rounded-2xl bg-card-bg-alt/40 border border-white/5 flex flex-col gap-4 hover:border-white/10 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-primary-green">{dispute.disputeId}</span>
                    <span className="text-xs text-text-muted">•</span>
                    <span className="font-mono text-xs text-white/70">Ref: {dispute.transactionId}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent-soft-red text-accent-red border border-accent-red/30 w-fit">
                    {dispute.status}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-white">${dispute.amount.toFixed(2)} Disputed Amount</span>
                    <span className="text-xs text-text-muted">
                      Disputing User: <strong className="text-white">{dispute.disputingUser}</strong> vs Respondent: <strong className="text-white">{dispute.respondentUser}</strong>
                    </span>
                    <p className="text-xs text-white/80 mt-1 font-sans">Reason: &ldquo;{dispute.reason}&rdquo;</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => alert(`Reviewing evidence for ${dispute.disputeId}`)}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-colors cursor-pointer"
                    >
                      Review Evidence
                    </button>
                    <button
                      onClick={() => alert(`Resolving dispute ${dispute.disputeId}`)}
                      className="px-3.5 py-1.5 rounded-xl bg-primary-green text-text-main text-xs font-bold hover:brightness-110 transition-all cursor-pointer"
                    >
                      Resolve Dispute
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
