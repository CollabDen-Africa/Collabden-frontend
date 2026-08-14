"use client";

import React from "react";
import { Table, Column } from "@/components/ui/Table";
import EmptyState from "@/components/ui/EmptyState";
import { HiOutlineCreditCard } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { PaymentTransactionItem } from "@/services/admin/payments.service";

interface PaymentsTableProps {
  data: PaymentTransactionItem[];
  isLoading?: boolean;
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const normalizedStatus = status.toUpperCase();
  const styleMap: Record<string, string> = {
    COMPLETED: "bg-accent-soft-green text-accent-green-success border border-accent-green-success/20",
    PENDING: "bg-accent-yellow/10 text-accent-yellow border border-accent-yellow/20",
    PROCESSING: "bg-accent-yellow/10 text-accent-yellow border border-accent-yellow/20",
    "ESCROW HELD": "bg-primary-blue/20 text-secondary-blue border border-primary-blue/30",
    ESCROW_CREDIT: "bg-primary-blue/20 text-secondary-blue border border-primary-blue/30",
    ESCROW_DEBIT: "bg-primary-blue/20 text-secondary-blue border border-primary-blue/30",
    FAILED: "bg-accent-soft-red text-accent-red border border-accent-red/20",
    REVERSED: "bg-white/10 text-white/50 border border-white/10",
    REFUNDED: "bg-white/10 text-white/50 border border-white/10",
  };

  const displayLabels: Record<string, string> = {
    COMPLETED: "Completed",
    PENDING: "Processing",
    PROCESSING: "Processing",
    ESCROW_CREDIT: "Escrow Held",
    ESCROW_DEBIT: "Escrow Released",
    FAILED: "Failed",
    REVERSED: "Refunded",
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${styleMap[normalizedStatus] || styleMap.COMPLETED}`}>
      {displayLabels[normalizedStatus] || status}
    </span>
  );
};

export const PaymentsTable: React.FC<PaymentsTableProps> = ({ data, isLoading }) => {
  const router = useRouter();

  const columns: Column<PaymentTransactionItem>[] = [
    {
      key: "transactionId",
      label: "TRANSACTION ID",
      render: (row) => (
        <span className="font-mono text-xs font-semibold text-white group-hover:text-primary-green transition-colors">
          {row.transactionId}
        </span>
      ),
    },
    {
      key: "payer",
      label: "USER / PAYER",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-card-bg border border-white/10 flex items-center justify-center text-xs font-bold text-white uppercase shrink-0">
            {row.payerName[0]}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white">{row.payerName}</span>
            <span className="text-[11px] text-text-muted">{row.payerEmail}</span>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      label: "PAYMENT TYPE",
      render: (row) => (
        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-white/5 text-white/80 border border-white/10">
          {row.type}
        </span>
      ),
    },
    {
      key: "amount",
      label: "AMOUNT",
      render: (row) => (
        <span className="text-xs font-bold text-white font-mono">
          ${row.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      key: "status",
      label: "STATUS",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "gateway",
      label: "GATEWAY",
      render: (row) => <span className="text-xs text-text-muted">{row.gateway}</span>,
    },
    {
      key: "date",
      label: "DATE & TIME",
      render: (row) => (
        <span className="text-xs font-mono text-white/60">
          {new Date(row.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </span>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={data}
      isLoading={isLoading}
      onRowClick={(row) => router.push(`/admin/payments/${row.id}`)}
      emptyState={
        <div className="py-6 px-4">
          <EmptyState
            icon={<HiOutlineCreditCard size={36} />}
            title="No Payments Found"
            description="No transaction records match your search or filter parameters."
          />
        </div>
      }
    />
  );
};
