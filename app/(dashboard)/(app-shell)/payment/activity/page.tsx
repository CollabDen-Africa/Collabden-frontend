"use client";
import React from "react";
import {
  FiArrowDownLeft,
  FiArrowUpRight,
  FiLock,
  FiPlus,
  FiActivity
} from "react-icons/fi";
import EmptyState from "@/components/ui/EmptyState";
import { usePayment } from "@/hooks/payment/usePayment";

export default function ActivityHistoryPage() {
  // Fetch transaction history 
  const { useTransactions } = usePayment();
  const { data: txData, isLoading } = useTransactions(undefined, undefined, 1, 50);

  const activities = txData?.transactions || [];

  // Format currency dynamically with +/- prefixes based on flow direction
  const formatAmount = (amount: number, type: string) => {
    const isOutflow = type === "WITHDRAWAL" || type === "ESCROW_DEBIT";
    const formatted = new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "NGN", 
      minimumFractionDigits: 0,
    }).format(Math.abs(amount));
    
    return isOutflow ? `-${formatted}` : `+${formatted}`;
  };

  // Helper to get the icon, colors, and titles based on the transaction type
  const getActivityDetails = (type: string) => {
    switch (type?.toUpperCase()) {
      case "ESCROW_CREDIT":
        return {
          title: "Payment Received (Escrow)",
          icon: <FiArrowDownLeft size={18} />,
          style: "bg-primary-green/10 text-primary-green border-primary-green/20",
        };
      case "ESCROW_DEBIT":
        return {
          title: "Escrow Funded",
          icon: <FiLock size={18} />,
          style: "bg-primary-blue/10 text-secondary-blue border-primary-blue/40",
        };
      case "WITHDRAWAL":
        return {
          title: "Withdrawal Completed",
          icon: <FiArrowUpRight size={18} />,
          style: "bg-accent-red/10 text-accent-red-alt border-accent-red/20",
        };
      case "FUNDING":
        return {
          title: "Wallet Funded",
          icon: <FiPlus size={18} />,
          style: "bg-white/20 text-white border-white/40", 
        };
      default:
        return {
          title: "Transaction",
          icon: <FiActivity size={18} />,
          style: "bg-white/10 text-white border-white/30",
        };
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
    <div className="flex flex-col w-full px-5 lg:px-0 pb-10">
      {/* Empty State */}
      {activities.length === 0 ? (
        <EmptyState
          icon={<FiActivity size={32} strokeWidth={1.5} />}
          title="No Activity Yet"
          description="Your complete timeline of payments, escrow releases, and withdrawals will appear here."
        />
      ) : (
        <div className="w-full max-w-297.5 bg-black/10 backdrop-blur-xl border border-white/40 rounded-[30px] lg:rounded-[40px] p-6 lg:p-10 shadow-xl shadow-primary-blue/5">
          <div className="flex flex-col w-full">
            {activities.map((activity: any, index: number) => {
              const { title, icon, style } = getActivityDetails(activity.type);
              const isLast = index === activities.length - 1;
              const isOutflow = activity.type === "WITHDRAWAL" || activity.type === "ESCROW_DEBIT";
              
              // Format the Date directly from the ISO string
              const dateObj = new Date(activity.createdAt);
              const formattedDate = `${dateObj.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })} at ${dateObj.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;

              return (
                <div key={activity.id} className="flex gap-4 lg:gap-6 w-full group">
                  {/* Left Column: Timeline */}
                  <div className="flex flex-col items-center">
                    {/* Icon Circle */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border shrink-0 z-10 transition-transform group-hover:scale-110 duration-300 ${style}`}>
                      {icon}
                    </div>
                    
                    {/* Connecting Line */}
                    {!isLast && (
                      <div className="w-0.5 min-h-10 flex-1 bg-white/20 my-2 rounded-full" />
                    )}
                  </div>

                  {/* Right Column: Activity Details */}
                  <div className={`flex flex-col sm:flex-row sm:justify-between w-full pb-8 ${isLast ? 'pb-0' : ''}`}>
                    <div className="flex flex-col items-start gap-1 mb-3 sm:mb-0">
                      <span className="font-raleway font-semibold text-[16px] lg:text-[18px] leading-6 text-white">
                        {title}
                      </span>
                      
                      {(activity.description || activity.reference) && (
                        <span className="font-raleway font-normal text-[14px] lg:text-[15px] leading-5 text-white/60">
                          {activity.description || `Ref: ${activity.reference}`}
                        </span>
                      )}
                      
                      <span className="font-raleway font-medium text-[12px] lg:text-[13px] leading-4 text-white/50 mt-1">
                        {formattedDate}
                      </span>
                    </div>

                    <div className="flex items-start sm:items-center">
                      <span className={`font-raleway font-bold text-[18px] lg:text-[20px] leading-7 ${
                        isOutflow ? "text-accent-red-alt" : "text-primary-green"
                      }`}>
                        {formatAmount(activity.amount, activity.type)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}