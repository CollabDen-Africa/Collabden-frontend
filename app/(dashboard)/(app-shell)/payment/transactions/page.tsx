"use client";

import React, { useState, useMemo } from "react";
import { FiSearch, FiChevronDown, FiCheckCircle, FiClock, FiRefreshCw, FiInbox } from "react-icons/fi";
import EmptyState from "@/components/ui/EmptyState";
import Select from "@/components/ui/Select";

// --- MOCK DATA ---
const TABLE_HEADERS = ["Date", "Type", "Description", "Status", "Amount", "Reference"];

const MOCK_TRANSACTIONS: any[] = [
  { id: "TXN-2026-05-001", date: "May 27, 2026", time: "02:30 PM", type: "payment", description: "Brand Identity Design", party: "From: Marcus Chen", status: "successful", amount: 2500 },
  { id: "TXN-2026-05-002", date: "May 26, 2026", time: "10:15 AM", type: "escrow", description: "Website Redesign", party: "From: Sarah Williams", status: "processing", amount: 1800 },
  { id: "TXN-2026-05-003", date: "May 25, 2026", time: "04:45 PM", type: "withdrawal", description: "Bank Account ****4567", party: "", status: "successful", amount: -5000 },
  { id: "TXN-2026-05-004", date: "May 24, 2026", time: "11:20 AM", type: "payment", description: "Mobile App UI", party: "From: Alex Rodriguez", status: "successful", amount: 3200 },
  { id: "TXN-2026-05-005", date: "May 28, 2026", time: "12:20 AM", type: "payment", description: "Beats", party: "From: Olivia Rodrigo", status: "pending", amount: 8200 }
];

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All types");
  const [statusFilter, setStatusFilter] = useState("All status");

  const formatCurrency = (amount: number) => {
    const isNegative = amount < 0;
    const formatted = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(Math.abs(amount));
    return isNegative ? `-${formatted}` : `+${formatted}`;
  };

  const renderStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "successful":
        return (
          <div className="flex items-center gap-[8px] bg-accent-green-success/15 border border-accent-green-bright/20 px-[16px] py-[6px] rounded-full w-fit">
            <FiCheckCircle className="text-primary-green" size={16} />
            <span className="font-medium text-[14px] text-primary-green capitalize">{status}</span>
          </div>
        );
      case "processing":
        return (
          <div className="flex items-center gap-[8px] bg-primary-blue/20 border border-primary-blue/20 px-[16px] py-[6px] rounded-full w-fit">
            <FiRefreshCw className="text-secondary-blue animate-spin-slow" size={16} />
            <span className="font-medium text-[14px] text-secondary-blue capitalize">{status}</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-[8px] bg-white/30 border border-white/30 px-[16px] py-[6px] rounded-full w-fit">
            <FiClock className="text-white" size={16} />
            <span className="font-medium text-[14px] text-white capitalize">{status}</span>
          </div>
        );
    }
  }

  // The Magic Fix: Filter logic applies Search + Dropdowns
  const filteredTransactions = useMemo(() => {
    return MOCK_TRANSACTIONS.filter((txn) => {
      const matchesSearch = txn.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            txn.party.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === "All types" || txn.type.toLowerCase() === typeFilter.toLowerCase();
      const matchesStatus = statusFilter === "All status" || txn.status.toLowerCase() === statusFilter.toLowerCase();
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [searchQuery, typeFilter, statusFilter]);

  return (
    <div className="flex flex-col w-full px-[20px] lg:px-0">
      
      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row items-center gap-[16px] w-full mb-[30px] z-20 relative">
        <div className="flex-1 w-full h-[52px] bg-black/10 backdrop-blur-md border border-white/20 hover:border-primary-green focus-within:border-primary-green shadow-sm rounded-full flex items-center px-[20px] lg:px-[24px] transition-all duration-300">
          <FiSearch className="text-white/50 shrink-0" size={20} />
          <input
            type="text"
            placeholder="Search by project, transaction ID, or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 ml-[12px] bg-transparent border-none outline-none text-[14px] lg:text-[16px] font-raleway text-white placeholder:text-white/50"
          />
        </div>

        <div className="flex items-center gap-[12px] w-full lg:w-auto overflow-visible pb-2 lg:pb-0 z-30">
          {/* Custom Select for Type */}
          <div className="w-[160px]">
            <Select 
              value={typeFilter}
              onChange={setTypeFilter}
              options={["All types", "Payment", "Withdrawal", "Escrow"]}
              variant="glass"
              placeholder="All types"
            />
          </div>

          {/* Custom Select for Status */}
          <div className="w-[160px]">
            <Select 
              value={statusFilter}
              onChange={setStatusFilter}
              options={["All status", "Successful", "Processing", "Pending"]}
              variant="glass"
              placeholder="All status"
            />
          </div>

          {/* Time Filter (Kept as a visual button for now, or you can swap to Select) */}
          <button className="h-[52px] px-[24px] bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-between gap-[10px] whitespace-nowrap hover:border-primary-green transition-colors">
            <span className="font-medium text-[16px] text-white">Last 30 days</span>
            <FiChevronDown className="text-white/50" size={20} />
          </button>
        </div>
      </div>

      {/* Glassmorphism Data Table */}
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
            <table className="w-full min-w-[1000px] text-left border-collapse">
              <thead>
                <tr className="border-b border-primary-green/10 h-[72px] bg-white/10">
                  {TABLE_HEADERS.map((header) => (
                    <th key={header} className={`font-medium text-[16px] text-white px-[20px] lg:px-[33px] ${header === "Amount" ? "text-right" : ""}`}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((txn, index) => (
                  <tr key={txn.id} className={`border-accent-green-bright/10 hover:bg-accent-green-bright/10 transition-colors ${index !== filteredTransactions.length - 1 ? "border-b" : ""}`}>
                    <td className="py-[20px] px-[20px] lg:px-[33px]">
                      <div className="flex flex-col gap-[4px]">
                        <span className="font-medium text-[16px] text-white">{txn.date}</span>
                        <span className="font-normal text-[14px] text-white/60">{txn.time}</span>
                      </div>
                    </td>
                    <td className="py-[20px] px-[20px] lg:px-[33px]">
                      <div className="bg-white/10 border border-accent-green-bright/20 px-[16px] py-[6px] rounded-full w-fit">
                        <span className="font-normal text-[14px] text-white/80 capitalize">{txn.type}</span>
                      </div>
                    </td>
                    <td className="py-[20px] px-[20px] lg:px-[33px]">
                      <div className="flex flex-col gap-[4px]">
                        <span className="font-medium text-[16px] text-white">{txn.description}</span>
                        {txn.party && <span className="font-normal text-[14px] text-white/60">{txn.party}</span>}
                      </div>
                    </td>
                    <td className="py-[20px] px-[20px] lg:px-[33px]">{renderStatusBadge(txn.status)}</td>
                    <td className="py-[20px] px-[20px] lg:px-[33px] text-right">
                      <span className={`font-semibold text-[16px] ${txn.amount < 0 ? "text-accent-red-alt" : "text-primary-green"}`}>
                        {formatCurrency(txn.amount)}
                      </span>
                    </td>
                    <td className="py-[20px] px-[20px] lg:px-[33px]">
                      <span className="font-normal text-[14px] text-white/60">{txn.id}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}