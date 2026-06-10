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

// --- MOCK DATA ---
const MOCK_ACTIVITIES: any[] = [
  {
    id: "act_1",
    type: "payment_received",
    title: "Payment Received",
    subtitle: "Project: Brand Identity Design • From: Marcus Chen",
    date: "May 27, 2026 at 02:30 PM",
    amount: 2500,
  },
  {
    id: "act_2",
    type: "escrow_payment",
    title: "Escrow Payment",
    subtitle: "Project: Website Redesign • From: Sarah Williams",
    date: "May 26, 2026 at 10:15 AM",
    amount: 1800,
  },
  {
    id: "act_3",
    type: "withdrawal",
    title: "Withdrawal Completed",
    subtitle: "• To: Bank Account ****4567",
    date: "May 25, 2026 at 04:45 PM",
    amount: -5000,
  },
  {
    id: "act_4",
    type: "payment_received",
    title: "Payment Received",
    subtitle: "Project: Mobile App UI • From: Alex Rodriguez",
    date: "May 24, 2026 at 11:20 AM",
    amount: 3200,
  },
  {
    id: "act_5",
    type: "escrow_payment",
    title: "Escrow Payment",
    subtitle: "Project: Logo Design • From: Jennifer Lee",
    date: "May 23, 2026 at 09:30 AM",
    amount: 420,
  },
  {
    id: "act_6",
    type: "wallet_funded",
    title: "Wallet Funded",
    subtitle: "",
    date: "May 22, 2026 at 01:10 PM",
    amount: 1500,
  },
];

export default function ActivityHistoryPage() {

  // Format currency dynamically with +/- prefixes
  const formatAmount = (amount: number) => {
    const isPositive = amount > 0;
    const formatted = new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(Math.abs(amount));
    
    return isPositive ? `+${formatted}` : `-${formatted}`;
  };

  // Helper to get the icon and colors based on activity type
  const getActivityStyling = (type: string) => {
    switch (type) {
      case "payment_received":
        return {
          icon: <FiArrowDownLeft size={18} />,
          style: "bg-primary-green/10 text-primary-green border-primary-green/20",
        };
      case "escrow_payment":
        return {
          icon: <FiLock size={18} />,
          style: "bg-primary-blue/10 text-secondary-blue border-primary-blue/40",
        };
      case "withdrawal":
        return {
          icon: <FiArrowUpRight size={18} />,
          style: "bg-accent-red/10 text-accent-red-alt border-accent-red/20",
        };
      case "wallet_funded":
        return {
          icon: <FiPlus size={18} />,
          style: "bg-white/40 text-primary-blue border-white/40",
        };
      default:
        return {
          icon: <FiActivity size={18} />,
          style: "bg-white/40 text-primary-blue border-white/60",
        };
    }
  };

  return (
    <div className="flex flex-col w-full px-[20px] lg:px-0 pb-[40px]">
      
      {/* Empty State */}
      {MOCK_ACTIVITIES.length === 0 ? (
        <EmptyState 
          icon={<FiActivity size={32} strokeWidth={1.5} />}
          title="No Activity Yet"
          description="Your complete timeline of payments, escrow releases, and withdrawals will appear here."
        />
      ) : (
        <div className="w-full max-w-[1190px] bg-black/10 backdrop-blur-xl border border-white/40 rounded-[30px] lg:rounded-[40px] p-[24px] lg:p-[40px] shadow-xl shadow-primary-blue/5">
          
          <div className="flex flex-col w-full">
            {MOCK_ACTIVITIES.map((activity, index) => {
              const { icon, style } = getActivityStyling(activity.type);
              const isLast = index === MOCK_ACTIVITIES.length - 1;

              return (
                <div key={activity.id} className="flex gap-[16px] lg:gap-[24px] w-full group">
                  
                  {/* Left Column: Timeline */}
                  <div className="flex flex-col items-center">
                    {/* Icon Circle */}
                    <div className={`w-[40px] h-[40px] rounded-full flex items-center justify-center border shrink-0 z-10 transition-transform group-hover:scale-110 duration-300 ${style}`}>
                      {icon}
                    </div>
                    
                    {/* Connecting Line */}
                    {!isLast && (
                      <div className="w-[2px] min-h-[40px] flex-1 bg-white/50 my-[8px] rounded-full" />
                    )}
                  </div>

                  {/* Right Column: Activity Details */}
                  <div className={`flex flex-col sm:flex-row sm:justify-between w-full pb-[32px] ${isLast ? 'pb-0' : ''}`}>
                    
                    <div className="flex flex-col items-start gap-[4px] mb-[12px] sm:mb-0">
                      <span className="font-raleway font-semibold text-[16px] lg:text-[18px] leading-[24px] text-white">
                        {activity.title}
                      </span>
                      
                      {activity.subtitle && (
                        <span className="font-raleway font-normal text-[14px] lg:text-[15px] leading-[20px] text-white/60">
                          {activity.subtitle}
                        </span>
                      )}
                      
                      <span className="font-raleway font-medium text-[12px] lg:text-[13px] leading-[16px] text-white/50 mt-[4px]">
                        {activity.date}
                      </span>
                    </div>

                    <div className="flex items-start sm:items-center">
                      <span className={`font-raleway font-bold text-[18px] lg:text-[20px] leading-[28px] ${
                        activity.amount > 0 ? "text-primary-green" : "text-accent-red-alt"
                      }`}>
                        {formatAmount(activity.amount)}
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