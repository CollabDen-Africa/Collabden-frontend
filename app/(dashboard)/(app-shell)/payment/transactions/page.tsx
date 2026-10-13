"use client";

import React, { useState, useMemo } from "react";
import { FiSearch, FiCheckCircle, FiClock, FiRefreshCw, FiInbox } from "react-icons/fi";
import EmptyState from "@/components/ui/EmptyState";
import Select from "@/components/ui/Select";
import { usePayment } from "@/hooks/payment/usePayment";
import type { Transaction, TransactionType } from "@/types/payments.types";

const TABLE_HEADERS = ["Date", "Type", "Description", "Status", "Amount", "Reference"];

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All types");
  const [statusFilter, setStatusFilter] = useState("All status");
  const [timeFilter, setTimeFilter] = useState("All time");

  const { useTransactions, useWallet } = usePayment();
  const { data: wallet } = useWallet();
  const currency = wallet?.currency || "USD";

  // Map UI dropdowns to actual API Enums
  const apiStatusMap: Record<string, string | undefined> = {
    "All status": undefined,
    "Successful": "COMPLETED",
    "Processing": "PENDING",
    "Pending": "PENDING",
    "Failed": "FAILED",
  };

  const apiTypeMap: Record<string, string | undefined> = {
    "All types": undefined,
    Payment: "FUNDING",
    Withdrawal: "WITHDRAWAL",
    Escrow: undefined,
  };

  const { data: txData, isLoading } = useTransactions(
    apiTypeMap[typeFilter],
    apiStatusMap[statusFilter],
    1,
    50
  );

  const liveTransactions: Transaction[] = useMemo(() => {
    if (!txData) return [];
    if (Array.isArray(txData)) return txData;
    if (Array.isArray((txData as any).transactions)) return (txData as any).transactions;
    if (Array.isArray((txData as any).data)) return (txData as any).data;
    return [];
  }, [txData]);

  const isOutflow = (txn: Transaction) => {
    return txn.amount < 0 || txn.type === "WITHDRAWAL" || txn.type === "ESCROW_DEBIT";
  };

  const formatCurrency = (amount: number, type?: TransactionType) => {
    const outflow = amount < 0 || type === "WITHDRAWAL" || type === "ESCROW_DEBIT";
    const numAmount = Math.abs(Number(amount) || 0);
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      minimumFractionDigits: 0,
    }).format(numAmount);
    return outflow ? `-${formatted}` : `+${formatted}`;
  };

  const formatTypeLabel = (type?: string) => {
    if (!type) return "Transaction";
    switch (type.toUpperCase()) {
      case "FUNDING":
        return "Payment";
      case "WITHDRAWAL":
        return "Withdrawal";
      case "ESCROW_CREDIT":
        return "Escrow Credit";
      case "ESCROW_DEBIT":
        return "Escrow Debit";
      default:
        return type.replace(/_/g, " ").toLowerCase();
    }
  };

  const renderStatusBadge = (status?: string) => {
    const s = (status || "").toUpperCase();
    switch (s) {
      case "COMPLETED":
      case "SUCCESSFUL":
        return (
          <div className="flex items-center gap-2 bg-accent-green-success/15 border border-accent-green-bright/20 px-4 py-1.5 rounded-full w-fit">
            <FiCheckCircle className="text-primary-green" size={16} />
            <span className="font-medium text-[14px] text-primary-green capitalize">Successful</span>
          </div>
        );
      case "PENDING":
        return (
          <div className="flex items-center gap-2 bg-primary-blue/20 border border-primary-blue/20 px-4 py-1.5 rounded-full w-fit">
            <FiRefreshCw className="text-secondary-blue animate-spin-slow" size={16} />
            <span className="font-medium text-[14px] text-secondary-blue capitalize">Processing</span>
          </div>
        );
      case "FAILED":
      case "REVERSED":
        return (
          <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/20 px-4 py-1.5 rounded-full w-fit">
            <span className="font-medium text-[14px] text-red-400 capitalize">{s.toLowerCase()}</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 bg-white/30 border border-white/30 px-4 py-1.5 rounded-full w-fit">
            <FiClock className="text-white" size={16} />
            <span className="font-medium text-[14px] text-white capitalize">{status ? status.toLowerCase() : "Unknown"}</span>
          </div>
        );
    }
  };

  // Filter transactions by Search, Type, Status, and Time
  const filteredTransactions = useMemo(() => {
    return liveTransactions.filter((txn: Transaction) => {
      // Search query filtering
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const desc = txn.description?.toLowerCase() || "";
        const id = txn.id?.toLowerCase() || "";
        const ref = txn.reference?.toLowerCase() || "";
        const type = txn.type?.toLowerCase() || "";
        const status = txn.status?.toLowerCase() || "";
        const amountStr = String(txn.amount || "");

        const matchesSearch =
          desc.includes(q) ||
          id.includes(q) ||
          ref.includes(q) ||
          type.includes(q) ||
          status.includes(q) ||
          amountStr.includes(q);

        if (!matchesSearch) return false;
      }

      // Type filter (client-side enforcement)
      if (typeFilter !== "All types") {
        if (typeFilter === "Payment" && txn.type !== "FUNDING") return false;
        if (typeFilter === "Withdrawal" && txn.type !== "WITHDRAWAL") return false;
        if (
          typeFilter === "Escrow" &&
          !(txn.type === "ESCROW_CREDIT" || txn.type === "ESCROW_DEBIT" || txn.type?.includes("ESCROW"))
        ) {
          return false;
        }
      }

      // Status filter (client-side enforcement)
      if (statusFilter !== "All status") {
        if (statusFilter === "Successful" && txn.status !== "COMPLETED") return false;
        if ((statusFilter === "Processing" || statusFilter === "Pending") && txn.status !== "PENDING") {
          return false;
        }
        if (statusFilter === "Failed" && !(txn.status === "FAILED" || txn.status === "REVERSED")) {
          return false;
        }
      }

      // Time filter
      if (timeFilter !== "All time") {
        if (!txn.createdAt) return false;
        const txDate = new Date(txn.createdAt).getTime();
        if (isNaN(txDate)) return false;
        const now = Date.now();

        if (timeFilter === "Today") {
          const startOfToday = new Date();
          startOfToday.setHours(0, 0, 0, 0);
          if (txDate < startOfToday.getTime()) return false;
        } else if (timeFilter === "Last 7 days") {
          if (txDate < now - 7 * 24 * 60 * 60 * 1000) return false;
        } else if (timeFilter === "Last 30 days") {
          if (txDate < now - 30 * 24 * 60 * 60 * 1000) return false;
        }
      }

      return true;
    });
  }, [liveTransactions, searchQuery, typeFilter, statusFilter, timeFilter]);

  return (
    <div className="flex flex-col w-full px-5 lg:px-0">
      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row items-center gap-4 w-full mb-7.5 z-20 relative">
        <div className="flex-1 w-full h-13 bg-black/10 backdrop-blur-md border border-white/20 hover:border-primary-green focus-within:border-primary-green shadow-sm rounded-full flex items-center px-5 lg:px-6 transition-all duration-300">
          <FiSearch className="text-white/50 shrink-0" size={20} />
          <input
            type="text"
            placeholder="Search by project, transaction ID, or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 ml-3 bg-transparent border-none outline-none text-[14px] lg:text-[16px] font-raleway text-white placeholder:text-white/50"
          />
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto overflow-visible pb-2 lg:pb-0 z-30">
          {/* Custom Select for Type */}
          <div className="w-40">
            <Select
              value={typeFilter}
              onChange={setTypeFilter}
              options={["All types", "Payment", "Withdrawal", "Escrow"]}
              variant="glass"
              placeholder="All types"
            />
          </div>

          {/* Custom Select for Status */}
          <div className="w-40">
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                "All status",
                "Successful",
                "Processing",
                "Pending",
                "Failed",
              ]}
              variant="glass"
              placeholder="All status"
            />
          </div>

          {/* Time Filter */}
          <div className="w-40">
            <Select
              value={timeFilter}
              onChange={setTimeFilter}
              options={["All time", "Last 30 days", "Last 7 days", "Today"]}
              variant="glass"
              placeholder="All time"
            />
          </div>
        </div>
      </div>

      {/* Data Table */}

      {isLoading ? (
        <div className="w-full bg-black/10 border border-white/20 rounded-[30px] lg:rounded-[40px] overflow-hidden backdrop-blur-xl shadow-xl shadow-primary-green/5 relative z-10">
          <div className="w-full overflow-x-auto custom-scrollbar">
            <table className="w-full min-w-250 text-left border-collapse">
              <thead>
                <tr className="border-b border-primary-green/10 h-18 bg-white/10">
                  {TABLE_HEADERS.map((header) => (
                    <th
                      key={header}
                      className={`font-medium text-[16px] text-white px-5 lg:px-8.25 ${
                        header === "Amount" ? "text-right" : ""
                      }`}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, index) => (
                  <tr
                    key={index}
                    className={`border-accent-green-bright/10 ${
                      index !== 4 ? "border-b" : ""
                    } animate-pulse`}
                  >
                    <td className="py-5 px-5 lg:px-8.25">
                      <div className="h-4 w-28 bg-white/15 rounded-md mb-2" />
                      <div className="h-3 w-16 bg-white/10 rounded-md" />
                    </td>
                    <td className="py-5 px-5 lg:px-8.25">
                      <div className="h-7 w-24 bg-white/10 rounded-full" />
                    </td>
                    <td className="py-5 px-5 lg:px-8.25">
                      <div className="h-4 w-44 bg-white/15 rounded-md" />
                    </td>
                    <td className="py-5 px-5 lg:px-8.25">
                      <div className="h-7 w-28 bg-white/10 rounded-full" />
                    </td>
                    <td className="py-5 px-5 lg:px-8.25 text-right">
                      <div className="h-4 w-20 bg-white/15 rounded-md ml-auto" />
                    </td>
                    <td className="py-5 px-5 lg:px-8.25">
                      <div className="h-4 w-32 bg-white/10 rounded-md" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={<FiInbox size={32} strokeWidth={1.5} />}
            title="No Transactions Found"
            description="Try adjusting your search or filters to find what you're looking for."
          />
        </div>
      ) : (
        <div className="w-full bg-black/10 border border-white/20 rounded-[30px] lg:rounded-[40px] overflow-hidden backdrop-blur-xl shadow-xl shadow-primary-green/5 relative z-10">
          <div className="w-full overflow-x-auto custom-scrollbar">
            <table className="w-full min-w-250 text-left border-collapse">
              <thead>
                <tr className="border-b border-primary-green/10 h-18 bg-white/10">
                  {TABLE_HEADERS.map((header) => (
                    <th
                      key={header}
                      className={`font-medium text-[16px] text-white px-5 lg:px-8.25 ${
                        header === "Amount" ? "text-right" : ""
                      }`}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((txn, index) => {
                  const isValidDate =
                    txn.createdAt && !isNaN(new Date(txn.createdAt).getTime());
                  const dateObj = isValidDate ? new Date(txn.createdAt) : null;
                  const formattedDate = dateObj
                    ? dateObj.toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })
                    : "—";
                  const formattedTime = dateObj
                    ? dateObj.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "";
                  const outflow = isOutflow(txn);

                  return (
                    <tr
                      key={txn.id || index}
                      className={`border-accent-green-bright/10 hover:bg-white/10 transition-colors ${
                        index !== filteredTransactions.length - 1
                          ? "border-b"
                          : ""
                      }`}
                    >
                      <td className="py-5 px-5 lg:px-8.25">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-[16px] text-white">
                            {formattedDate}
                          </span>
                          {formattedTime && (
                            <span className="font-normal text-[14px] text-white/60">
                              {formattedTime}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-5 px-5 lg:px-8.25">
                        <div className="bg-white/10 border border-accent-green-bright/20 px-4 py-1.5 rounded-full w-fit">
                          <span className="font-normal text-[14px] text-white/80 capitalize">
                            {formatTypeLabel(txn.type)}
                          </span>
                        </div>
                      </td>
                      <td className="py-5 px-5 lg:px-8.25">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-[16px] text-white">
                            {txn.description || "No description provided"}
                          </span>
                        </div>
                      </td>
                      <td className="py-5 px-5 lg:px-8.25">
                        {renderStatusBadge(txn.status)}
                      </td>
                      <td className="py-5 px-5 lg:px-8.25 text-right">
                        <span
                          className={`font-semibold text-[16px] ${
                            outflow
                              ? "text-accent-red-alt"
                              : "text-primary-green"
                          }`}
                        >
                          {formatCurrency(txn.amount, txn.type)}
                        </span>
                      </td>
                      <td className="py-5 px-5 lg:px-8.25">
                        <span className="font-normal text-[14px] text-white/60">
                          {txn.reference || txn.id?.slice(0, 10) || "—"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}