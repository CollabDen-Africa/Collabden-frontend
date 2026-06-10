"use client";

import React from "react";
import { 
  FiFileText, 
  FiDownload, 
  FiCheckCircle, 
  FiClock, 
  FiAlertCircle 
} from "react-icons/fi";
import EmptyState from "@/components/ui/EmptyState";

// --- MOCK DATA ---
const MOCK_INVOICES: any[] = [
  {
    id: "INV-2026-005",
    date: "Jun 01, 2026",
    description: "Studio Pro Plan - Monthly Subscription",
    amount: 4900,
    status: "paid",
  },
  {
    id: "INV-2026-004",
    date: "May 01, 2026",
    description: "Studio Pro Plan - Monthly Subscription",
    amount: 4900,
    status: "paid",
  },
  {
    id: "INV-2026-003",
    date: "Apr 01, 2026",
    description: "Studio Pro Plan - Monthly Subscription",
    amount: 4900,
    status: "paid",
  },
  {
    id: "INV-2026-002",
    date: "Mar 01, 2026",
    description: "Marketplace Listing Fee - Featured",
    amount: 1500,
    status: "pending",
  },
  {
    id: "INV-2026-001",
    date: "Feb 01, 2026",
    description: "Studio Pro Plan - Monthly Subscription",
    amount: 4900,
    status: "failed",
  } 
];

export default function BillingHistoryPage() {
  
  // Format currency dynamically
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Status-based styling for the invoice badges
  const renderStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return (
          <div className="flex items-center gap-[6px] bg-primary-green/10 border border-primary-green/20 px-[12px] py-[6px] rounded-full w-fit">
            <FiCheckCircle className="text-primary-green" size={14} />
            <span className="font-raleway font-medium text-[12px] lg:text-[14px] text-primary-green capitalize">
              {status}
            </span>
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center gap-[6px] bg-primary-blue/10 border border-primary-blue/20 px-[12px] py-[6px] rounded-full w-fit">
            <FiClock className="text-secondary-blue" size={14} />
            <span className="font-raleway font-medium text-[12px] lg:text-[14px] text-secondary-blue capitalize">
              {status}
            </span>
          </div>
        );
      case "failed":
        return (
          <div className="flex items-center gap-[6px] bg-accent-red/10 border border-accent-red/20 px-[12px] py-[6px] rounded-full w-fit">
            <FiAlertCircle className="text-accent-red" size={14} />
            <span className="font-raleway font-medium text-[12px] lg:text-[14px] text-accent-red-alt capitalize">
              {status}
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center w-full px-[20px] lg:px-0 pb-[40px]">
      
      {/* Empty State */}
      {MOCK_INVOICES.length === 0 ? (
        <div className="w-full max-w-[1156px]">
          <EmptyState 
            icon={<FiFileText size={32} strokeWidth={1.5} />}
            title="Billing History"
            description="Access and download your invoices and payment receipts."
          />
        </div>
      ) : (
        /* INVOICES DATA TABLE                        */
        <div className="w-full max-w-[1156px] bg-black/10 border border-white/30 rounded-[30px] overflow-hidden backdrop-blur-xl shadow-xl shadow-primary-blue/5">
          
          {/* Table Header Wrapper for Mobile Scroll */}
          <div className="w-full overflow-x-auto custom-scrollbar">
            <table className="w-full min-w-[900px] text-left border-collapse">
              
              {/* Table Head */}
              <thead>
                <tr className="border-b border-white/30 h-[72px] bg-white/20">
                  <th className="font-raleway font-medium text-[15px] lg:text-[16px] text-white/70 px-[24px] lg:px-[32px]">Invoice ID</th>
                  <th className="font-raleway font-medium text-[15px] lg:text-[16px] text-white/70 px-[24px] lg:px-[32px]">Date</th>
                  <th className="font-raleway font-medium text-[15px] lg:text-[16px] text-white/70 px-[24px] lg:px-[32px]">Description</th>
                  <th className="font-raleway font-medium text-[15px] lg:text-[16px] text-white/70 px-[24px] lg:px-[32px]">Status</th>
                  <th className="font-raleway font-medium text-[15px] lg:text-[16px] text-white/70 px-[24px] lg:px-[32px] text-right">Amount</th>
                  <th className="font-raleway font-medium text-[15px] lg:text-[16px] text-white/70 px-[24px] lg:px-[32px] text-center">Action</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {MOCK_INVOICES.map((invoice, index) => (
                  <tr 
                    key={invoice.id} 
                    className={`border-white/30 hover:bg-accent-green-bright/30 transition-colors ${
                      index !== MOCK_INVOICES.length - 1 ? "border-b" : ""
                    }`}
                  >
                    
                    {/* Invoice ID */}
                    <td className="py-[24px] px-[24px] lg:px-[32px]">
                      <span className="font-raleway font-semibold text-[15px] lg:text-[16px] text-white">
                        {invoice.id}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-[24px] px-[24px] lg:px-[32px]">
                      <span className="font-raleway font-normal text-[15px] lg:text-[16px] text-white/70">
                        {invoice.date}
                      </span>
                    </td>

                    {/* Description */}
                    <td className="py-[24px] px-[24px] lg:px-[32px]">
                      <span className="font-raleway font-medium text-[15px] lg:text-[16px] text-white">
                        {invoice.description}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-[24px] px-[24px] lg:px-[32px]">
                      {renderStatusBadge(invoice.status)}
                    </td>

                    {/* Amount */}
                    <td className="py-[24px] px-[24px] lg:px-[32px] text-right">
                      <span className="font-raleway font-semibold text-[15px] lg:text-[16px] text-white">
                        {formatCurrency(invoice.amount)}
                      </span>
                    </td>

                    {/* Download Action */}
                    <td className="py-[24px] px-[24px] lg:px-[32px]">
                      <div className="flex justify-center">
                        <button 
                          className="w-[40px] h-[40px] rounded-full bg-white/20 border border-white/80 flex items-center justify-center hover:bg-white/30 hover:text-white transition-all duration-300 text-white/60"
                          title="Download Invoice"
                        >
                          <FiDownload size={18} />
                        </button>
                      </div>
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