"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { name: "Overview", path: "/payment" },
  { name: "Transactions", path: "/payment/transactions" },
  { name: "Escrow Payments", path: "/payment/escrow-payments" },
  { name: "Withdrawals", path: "/payment/withdrawals" },
  { name: "Wallet", path: "/payment/wallet" },
  { name: "Billing History", path: "/payment/billing-history" },
  { name: "Activity", path: "/payment/activity" },
  { name: "Bank Accounts", path: "/payment/bank-accounts" }
];

const PAGE_HEADERS: Record<string, { title: string; subtitle: string }> = {
  "/payment": {
    title: "Payment Overview",
    subtitle: "Track your earnings, manage payments, and monitor your financial activity"
  },
  "/payment/transactions": {
    title: "Transactions",
    subtitle: "Complete history of your payments and transfers"
  },
  "/payment/escrow-payments": {
    title: "Escrow Payments",
    subtitle: "Track milestone-based escrow payments and releases"
  },
  "/payment/withdrawals": {
    title: "Withdrawals",
    subtitle: "Manage your fund withdrawals to bank accounts"
  },
  "/payment/wallet": {
    title: "Wallet",
    subtitle: "View wallet balance and funding history"
  },
  "/payment/activity": {
    title: "Activity History",
    subtitle: "Review your complete payment activity timeline"
  },
  "/payment/billing-history": {
    title: "Billing History",
    subtitle: "Access invoices and payment records"
  },
  "/payment/bank-accounts": {
    title: "Bank Account",
    subtitle: "Manage your linked bank accounts for withdrawals"
  }
};

export default function PaymentsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Dynamically pull the header text based on the route, fallback to default
  const headerInfo = useMemo(() => {
    return PAGE_HEADERS[pathname] || { 
      title: "Don't forget to add the header", 
      subtitle: "Should have done this for the workspace" 
    };
  }, [pathname]);

  return (
    <div className="w-full min-h-screen flex flex-col items-center pt-[30px] lg:pt-[67px] font-sans pb-[40px] relative overflow-hidden">
      
      

      <div className="flex flex-col w-full max-w-[1234px] px-[20px] lg:px-[0px] z-10 flex-1">
        
        {/* SHARED NAVIGATION TABS                     */}
        <div className="w-full flex items-center justify-start lg:justify-center overflow-x-auto custom-scrollbar gap-[15px] lg:gap-[40px] pb-4 mb-[40px] px-2">
          {TABS.map((tab) => {
            const isActive = pathname === tab.path;
            
            return (
              <Link
                key={tab.name}
                href={tab.path}
                className={`whitespace-nowrap pb-2 font-medium text-[16px] lg:text-[18px] leading-[21px] transition-all border-b-[2.5px] ${
                  isActive
                    ? "text-white border-primary-green"
                    : "text-white/50 border-transparent hover:text-primary-green/80"
                }`}
              >
                {tab.name}
              </Link>
            );
          })}
        </div>

        {/* DYNAMIC PAGE HEADER                        */}
        <div className="flex flex-col gap-[16px] mb-[40px] px-[20px] lg:px-[0px]">
          <h1 className="font-semibold text-[28px] lg:text-[32px] leading-[38px] text-white">
            {headerInfo.title}
          </h1>
          <p className="font-medium text-[14px] lg:text-[16px] leading-[19px] text-white/60">
            {headerInfo.subtitle}
          </p>
        </div>

        {/* TAB CONTENT (CHILDREN)                     */}
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>

      </div>
    </div>
  );
}