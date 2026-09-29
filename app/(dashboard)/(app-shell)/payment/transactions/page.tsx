"use client";

import React, { useState, useMemo } from "react";
import { FiSearch, FiChevronDown, FiCheckCircle, FiClock, FiRefreshCw, FiInbox } from "react-icons/fi";
import EmptyState from "@/components/ui/EmptyState";
import Select from "@/components/ui/Select";
import { usePayment } from "@/hooks/payment/usePayment";

const TABLE_HEADERS = ["Date", "Type", "Description", "Status", "Amount", "Reference"];

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All types");
  const [statusFilter, setStatusFilter] = useState("All status");
  const [timeFilter, setTimeFilter] = useState("All time")

  const { useTransactions } = usePayment();

  // Map UI dropdowns to actual API Enums
    const apiStatusMap: Record<string, string | undefined> = {
      "All status": undefined,
      "Successful": "COMPLETED",
      "Processing": "PENDING",
      "Pending": "PENDING"
    };
    
    const apiTypeMap: Record<string, string | undefined> = {
      "All types": undefined,
      "Payment": "FUNDING",
      "Withdrawal": "WITHDRAWAL",
      "Escrow": "ESCROW_CREDIT" 
    };

  const formatCurrency = (amount: number) => {
    const isNegative = amount < 0;
    const formatted = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(Math.abs(amount));
    return isNegative ? `-${formatted}` : `+${formatted}`;
  };

  const renderStatusBadge = (status: string) => {
      switch (status.toUpperCase()) {
        case "COMPLETED":
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
              <span className="font-medium text-[14px] text-red-400 capitalize">{status.toLowerCase()}</span>
            </div>
          );
        default:
          return (
            <div className="flex items-center gap-2 bg-white/30 border border-white/30 px-4 py-1.5 rounded-full w-fit">
              <FiClock className="text-white" size={16} />
              <span className="font-medium text-[14px] text-white capitalize">{status.toLowerCase()}</span>
            </div>
          );
      }
    };

  // Fetch live data (fetching page 1, 50 limits for now to allow client-side searching)
    const { data: txData } = useTransactions(apiTypeMap[typeFilter], apiStatusMap[statusFilter], 1, 50);
  const liveTransactions = txData?.transactions || [];

  
  // Client-side search filtering
    const filteredTransactions = useMemo(() => {
      return liveTransactions.filter((txn) => {
        if (!searchQuery) return true;
        const searchLower = searchQuery.toLowerCase();
        return (
          txn.description?.toLowerCase().includes(searchLower) ||
          txn.id.toLowerCase().includes(searchLower) ||
          txn.reference?.toLowerCase().includes(searchLower)
        );
      });
  }, [searchQuery, typeFilter, statusFilter]);

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
              options={["All status", "Successful", "Processing", "Pending"]}
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
              placeholder="Last 30 days"
            />
          </div>
        </div>
      </div>

      {/* Data Table */}
      {/* CONDITIONAL RENDERING: Empty State vs Data Table */}
      {filteredTransactions.length === 0 ? (
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
                    <th key={header} className={`font-medium text-[16px] text-white px-5 lg:px-8.25 ${header === "Amount" ? "text-right" : ""}`}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((txn, index) => {
                  // Format the ISO date dynamically
                  const dateObj = new Date(txn.createdAt);
                  const formattedDate = dateObj.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
                  const formattedTime = dateObj.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
              
                  return (
                    <tr key={txn.id} className={`border-accent-green-bright/10 hover:bg-white/10 transition-colors ${index !== filteredTransactions.length - 1 ? "border-b" : ""}`}>
                      <td className="py-5 px-5 lg:px-8.25">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-[16px] text-white">{formattedDate}</span>
                          <span className="font-normal text-[14px] text-white/60">{formattedTime}</span>
                        </div>
                      </td>
                      <td className="py-5 px-5 lg:px-8.25">
                        <div className="bg-white/10 border border-accent-green-bright/20 px-4 py-1.5 rounded-full w-fit">
                          {/* Replace underscores with spaces for escrow types */}
                          <span className="font-normal text-[14px] text-white/80 capitalize">{txn.type.replace('_', ' ').toLowerCase()}</span>
                        </div>
                      </td>
                      <td className="py-5 px-5 lg:px-8.25">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-[16px] text-white">{txn.description || "No description provided"}</span>
                        </div>
                      </td>
                      <td className="py-5 px-5 lg:px-8.25">{renderStatusBadge(txn.status)}</td>
                      <td className="py-5 px-5 lg:px-8.25 text-right">
                        <span className={`font-semibold text-[16px] ${txn.amount < 0 ? "text-accent-red-alt" : "text-primary-green"}`}>
                          {formatCurrency(txn.amount)}
                        </span>
                      </td>
                      <td className="py-5 px-5 lg:px-8.25">
                        <span className="font-normal text-[14px] text-white/60">{txn.reference}</span>
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