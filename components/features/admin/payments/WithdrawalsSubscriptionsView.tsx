"use client";

import React, { useState } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { StatCard } from "@/components/features/admin/shared/StatCard";
import { Tabs } from "@/components/ui/Tabs";
import { Table, Column } from "@/components/ui/Table";
import EmptyState from "@/components/ui/EmptyState";
import { HiOutlineCash, HiOutlineSparkles, HiCheck, HiX } from "react-icons/hi";
import { useAdminPayments } from "@/hooks/admin/useAdminPayments";
import { WithdrawalRequestItem, ActiveSubscriptionItem } from "@/services/admin/payments.service";

export const WithdrawalsSubscriptionsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Withdrawal Requests");
  const { withdrawals, subscriptions, totalWithdrawals, totalSubscriptions, isLoadingWithdrawals } = useAdminPayments({
    loadStats: false,
    loadTransactions: false,
    loadWithdrawals: true,
    loadSubscriptions: true,
  });

  const withdrawalColumns: Column<WithdrawalRequestItem>[] = [
    {
      key: "requestId",
      label: "REQUEST ID",
      render: (row) => <span className="font-mono text-xs font-semibold text-white">{row.requestId}</span>,
    },
    {
      key: "user",
      label: "USER",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-xs font-bold text-white">{row.userName}</span>
          <span className="text-[11px] text-text-muted">{row.userEmail}</span>
        </div>
      ),
    },
    {
      key: "amount",
      label: "AMOUNT",
      render: (row) => <span className="text-xs font-bold font-mono text-primary-green">${row.amount.toFixed(2)}</span>,
    },
    {
      key: "method",
      label: "PAYOUT METHOD",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-white/90">{row.method}</span>
          <span className="text-[10px] text-text-muted">{row.accountDetails}</span>
        </div>
      ),
    },
    {
      key: "status",
      label: "STATUS",
      render: (row) => (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent-yellow/10 text-accent-yellow border border-accent-yellow/30">
          {row.status}
        </span>
      ),
    },
    {
      key: "actions",
      label: "ACTIONS",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => alert(`Approved withdrawal ${row.requestId}`)}
            className="p-1.5 rounded-lg bg-accent-soft-green text-accent-green-success hover:bg-accent-green-success/20 transition-colors"
            title="Approve"
          >
            <HiCheck size={16} />
          </button>
          <button
            onClick={() => alert(`Declined withdrawal ${row.requestId}`)}
            className="p-1.5 rounded-lg bg-accent-soft-red text-accent-red hover:bg-accent-red/20 transition-colors"
            title="Decline"
          >
            <HiX size={16} />
          </button>
        </div>
      ),
    },
  ];

  const subscriptionColumns: Column<ActiveSubscriptionItem>[] = [
    {
      key: "user",
      label: "SUBSCRIBER",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-xs font-bold text-white">{row.userName}</span>
          <span className="text-[11px] text-text-muted">{row.userEmail}</span>
        </div>
      ),
    },
    {
      key: "planTier",
      label: "TIER",
      render: (row) => (
        <span
          className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
            row.planTier === "ELITE"
              ? "bg-accent-yellow/20 text-accent-yellow border border-accent-yellow/30"
              : "bg-primary-blue/20 text-secondary-blue border border-primary-blue/30"
          }`}
        >
          {row.planTier}
        </span>
      ),
    },
    {
      key: "billingCycle",
      label: "CYCLE",
      render: (row) => <span className="text-xs text-white/80">{row.billingCycle}</span>,
    },
    {
      key: "amount",
      label: "PRICE",
      render: (row) => <span className="text-xs font-bold font-mono text-white">${row.amount}/mo</span>,
    },
    {
      key: "nextBillingDate",
      label: "NEXT RENEWAL",
      render: (row) => <span className="text-xs font-mono text-text-muted">{row.nextBillingDate}</span>,
    },
  ];

  return (
    <div className="w-full flex flex-col gap-8 pb-12 animate-in fade-in duration-300">
      {/* Breadcrumb Trail */}
      <Breadcrumbs
        items={[
          { label: "Admin Portal" },
          { label: "Payments", href: "/admin/payments" },
          { label: "Withdrawals & Subscriptions" },
        ]}
      />

      {/* Header Bar */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight font-sans">
          Withdrawals & Subscription Payments
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Review pending user payout withdrawals and monitor active membership subscription tiers.
        </p>
      </div>

      {/* 4 KPI Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Withdrawals" value="$1,240,000" color="bg-primary-green" />
        <StatCard label="Pending Requests" value="18" color="bg-accent-yellow" />
        <StatCard label="Active Subscriptions" value="1,450" color="bg-primary-blue" />
        <StatCard label="Monthly Rec. Revenue" value="$45,200" color="bg-primary-green" />
      </div>

      {/* Main Tabbed Container */}
      <div className="bg-card-bg-alt/30 border border-white/5 rounded-2xl p-4 flex flex-col gap-5">
        <Tabs
          tabs={["Withdrawal Requests", "Subscription Memberships"]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {activeTab === "Withdrawal Requests" ? (
          <Table
            columns={withdrawalColumns}
            data={withdrawals}
            isLoading={isLoadingWithdrawals}
            emptyState={
              <div className="py-6 px-4">
                <EmptyState
                  icon={<HiOutlineCash size={36} />}
                  title="No Pending Payout Requests"
                  description="There are currently no pending user withdrawal requests requiring approval."
                />
              </div>
            }
          />
        ) : (
          <Table
            columns={subscriptionColumns}
            data={subscriptions}
            isLoading={isLoadingWithdrawals}
            emptyState={
              <div className="py-6 px-4">
                <EmptyState
                  icon={<HiOutlineSparkles size={36} />}
                  title="No Active Membership Subscriptions"
                  description="No paid membership subscriptions have been registered."
                />
              </div>
            }
          />
        )}
      </div>
    </div>
  );
};
