"use client";

import React, { useState } from "react";
import { HiOutlineSearch, HiPlus, HiOutlineExclamationCircle, HiOutlineDocumentText } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { StatCard } from "@/components/features/admin/shared/StatCard";
import { ExportCSVButton } from "@/components/ui/ExportCSVButton";
import { Pagination } from "@/components/ui/Pagination";
import { PaymentsTable } from "./PaymentsTable";
import { ManualPayoutModal } from "./ManualPayoutModal";
import { useAdminPayments } from "@/hooks/admin/useAdminPayments";

export const AdminPaymentsView: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");
  const [page, setPage] = useState(1);
  const limit = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    stats,
    isLoadingStats,
    transactions,
    totalTransactions,
    isLoadingTransactions,
    triggerManualPayout,
  } = useAdminPayments({
    page,
    limit,
    search: searchTerm || undefined,
    status: activeStatus !== "All" ? activeStatus : undefined,
  });

  const filteredTransactions = transactions;

  return (
    <div className="w-full flex flex-col gap-8 pb-12 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight font-sans">
            Payment Management
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Monitor escrow balances, track payment transactions, and audit payouts across the platform.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-green text-text-main text-xs font-bold hover:brightness-110 transition-all cursor-pointer shadow-lg"
          >
            <HiPlus size={16} />
            Process Manual Payout
          </button>
          <ExportCSVButton
            data={filteredTransactions}
            filename="payments-history.csv"
            headers={[
              { label: "Transaction ID", key: "transactionId" },
              { label: "Payer Name", key: "payerName" },
              { label: "Payer Email", key: "payerEmail" },
              { label: "Type", key: "type" },
              { label: "Amount ($)", key: "amount" },
              { label: "Status", key: "status" },
              { label: "Date", key: "createdAt" },
            ]}
          />
        </div>
      </div>

      {/* Sub-Nav Quick Action Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => router.push("/admin/payments/disputes")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold transition-colors cursor-pointer"
        >
          <HiOutlineExclamationCircle size={16} />
          Payment Disputes & Chargebacks
        </button>
        <button
          onClick={() => router.push("/admin/payments/withdrawals")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-colors cursor-pointer"
        >
          Withdrawals & Subscriptions
        </button>
        <button
          onClick={() => router.push("/admin/payments/reports")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-colors cursor-pointer"
        >
          <HiOutlineDocumentText size={16} />
          Reports & Audit History
        </button>
      </div>

      {/* 5 KPI Stat Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          label="Total Payments"
          value={`$${(stats?.totalPayments || 0).toLocaleString()}`}
          color="bg-primary-green"
          isLoading={isLoadingStats}
        />
        <StatCard
          label="Net Revenue"
          value={`$${(stats?.netRevenue || 0).toLocaleString()}`}
          color="bg-primary-green"
          isLoading={isLoadingStats}
        />
        <StatCard
          label="Escrow Held"
          value={`$${(stats?.escrowHeld || 0).toLocaleString()}`}
          color="bg-primary-blue"
          isLoading={isLoadingStats}
        />
        <StatCard
          label="Pending Payouts"
          value={`$${(stats?.pendingPayouts || 0).toLocaleString()}`}
          color="bg-accent-yellow"
          isLoading={isLoadingStats}
        />
        <StatCard
          label="Refund Claims"
          value={`$${(stats?.refundClaims || 0).toLocaleString()}`}
          color="bg-accent-red"
          isRedAlert
          isLoading={isLoadingStats}
        />
      </div>

      {/* Main Table & Filter Container */}
      <div className="bg-card-bg-alt/30 border border-white/5 rounded-2xl p-4 flex flex-col gap-4">
        {/* Search & Status Filter Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md w-full">
            <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input
              type="text"
              placeholder="Search by transaction ID, user, or type..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-primary-green transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { value: "All", label: "All" },
              { value: "COMPLETED", label: "Completed" },
              { value: "PENDING", label: "Pending" },
              { value: "FAILED", label: "Failed" },
              { value: "REVERSED", label: "Reversed" },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => {
                  setActiveStatus(filter.value);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  activeStatus === filter.value
                    ? "bg-primary-green text-text-main border-primary-green"
                    : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Payments Data Grid */}
        <PaymentsTable data={filteredTransactions} isLoading={isLoadingTransactions} />

        {/* Pagination */}
        <Pagination
          currentPage={page}
          totalPages={Math.ceil((totalTransactions || filteredTransactions.length) / limit) || 1}
          onPageChange={setPage}
          currentItemsCount={filteredTransactions.length}
          totalItems={totalTransactions || filteredTransactions.length}
          itemName="payments"
        />
      </div>

      {/* Process Manual Payout Modal */}
      <ManualPayoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={triggerManualPayout}
      />
    </div>
  );
};
