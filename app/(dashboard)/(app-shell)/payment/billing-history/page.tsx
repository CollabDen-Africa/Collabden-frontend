"use client";
import React from "react";
import {
  FiFileText,
  FiDownload,
  FiCheckCircle,
  FiAlertCircle
} from "react-icons/fi";
import EmptyState from "@/components/ui/EmptyState";
import { useSubscription } from "@/hooks/subscription/useSubscription";
import subscriptionService from "@/services/subscription.service";

export default function BillingHistoryPage() {
  const { useBillingHistory } = useSubscription();
  const { data: billingData, isLoading } = useBillingHistory(1, 20);
  
  const invoices = billingData?.invoices || [];

  // Format currency dynamically
  const formatCurrency = (amount: number, currency = "NGN") => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Status-based styling mapped to "PAID" | "UNPAID" API enums
  const renderStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PAID":
        return (
          <div className="flex items-center gap-1.5 bg-primary-green/10 border border-primary-green/20 px-3 py-1.5 rounded-full w-fit">
            <FiCheckCircle className="text-primary-green" size={14} />
            <span className="font-raleway font-medium text-[12px] lg:text-[14px] text-primary-green capitalize">
              Paid
            </span>
          </div>
        );
      case "UNPAID":
        return (
          <div className="flex items-center gap-1.5 bg-accent-red/10 border border-accent-red/20 px-3 py-1.5 rounded-full w-fit">
            <FiAlertCircle className="text-accent-red" size={14} />
            <span className="font-raleway font-medium text-[12px] lg:text-[14px] text-accent-red-alt capitalize">
              Unpaid
            </span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5 bg-white/10 border border-white/20 px-3 py-1.5 rounded-full w-fit">
            <span className="font-raleway font-medium text-[12px] lg:text-[14px] text-white capitalize">
              {status?.toLowerCase()}
            </span>
          </div>
        );
    }
  };

  const handleDownload = async (invoiceId: string) => {
    try {
      const blob = await subscriptionService.getInvoicePdf(invoiceId);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${invoiceId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error("Failed to download invoice:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex w-full justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-green"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full px-5 lg:px-0 pb-10">
      {/* Empty State */}
      {invoices.length === 0 ? (
        <div className="w-full max-w-289">
          <EmptyState
            icon={<FiFileText size={32} strokeWidth={1.5} />}
            title="Billing History"
            description="Access and download your invoices and payment receipts."
          />
        </div>
      ) : (
        /* INVOICES DATA TABLE */
        <div className="w-full max-w-289 bg-black/10 border border-white/30 rounded-[30px] overflow-hidden backdrop-blur-xl shadow-xl shadow-primary-blue/5">
          <div className="w-full overflow-x-auto custom-scrollbar">
            <table className="w-full min-w-225 text-left border-collapse">
              <thead>
                <tr className="border-b border-white/30 h-18 bg-white/20">
                  <th className="font-raleway font-medium text-[15px] lg:text-[16px] text-white/70 px-6 lg:px-8">Invoice ID</th>
                  <th className="font-raleway font-medium text-[15px] lg:text-[16px] text-white/70 px-6 lg:px-8">Date</th>
                  <th className="font-raleway font-medium text-[15px] lg:text-[16px] text-white/70 px-6 lg:px-8">Description</th>
                  <th className="font-raleway font-medium text-[15px] lg:text-[16px] text-white/70 px-6 lg:px-8">Status</th>
                  <th className="font-raleway font-medium text-[15px] lg:text-[16px] text-white/70 px-6 lg:px-8 text-right">Amount</th>
                  <th className="font-raleway font-medium text-[15px] lg:text-[16px] text-white/70 px-6 lg:px-8 text-center">Action</th>
                </tr>
              </thead>
              
              <tbody>
                {invoices.map((invoice: any, index: number) => {
                  // Uses billingDate per the UserSubscription API typing
                  const formattedDate = new Date(invoice.billingDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
                  
                  return (
                    <tr
                      key={invoice.id}
                      className={`border-white/30 hover:bg-accent-green-bright/30 transition-colors ${
                        index !== invoices.length - 1 ? "border-b" : ""
                      }`}
                    >
                      <td className="py-6 px-6 lg:px-8">
                        <span className="font-raleway font-semibold text-[15px] lg:text-[16px] text-white">
                          {invoice.id}
                        </span>
                      </td>
                      
                      <td className="py-6 px-6 lg:px-8">
                        <span className="font-raleway font-normal text-[15px] lg:text-[16px] text-white/70">
                          {formattedDate}
                        </span>
                      </td>
                      
                      <td className="py-6 px-6 lg:px-8">
                        <span className="font-raleway font-medium text-[15px] lg:text-[16px] text-white">
                          Subscription Plan Billing
                        </span>
                      </td>
                      
                      <td className="py-6 px-6 lg:px-8">
                        {renderStatusBadge(invoice.status)}
                      </td>
                      
                      <td className="py-6 px-6 lg:px-8 text-right">
                        <span className="font-raleway font-semibold text-[15px] lg:text-[16px] text-white">
                          {formatCurrency(invoice.amount)}
                        </span>
                      </td>
                      
                      <td className="py-6 px-6 lg:px-8">
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleDownload(invoice.id)}
                            className="w-10 h-10 rounded-full bg-white/20 border border-white/80 flex items-center justify-center hover:bg-white/30 hover:text-white transition-all duration-300 text-white/60"
                            title="Download Invoice"
                          >
                            <FiDownload size={18} />
                          </button>
                        </div>
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