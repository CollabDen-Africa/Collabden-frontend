"use client";

import React, { useState} from "react";
import { useRouter } from 'next/navigation';
import { 
  FiCreditCard, 
  FiPlus, 
  FiArrowUpRight, 
  FiPackage, 
  FiCheckCircle, 
  FiSettings,
  FiZap
} from "react-icons/fi";
import AddFundsOverlay from "@/components/features/wallet/AddFunds";
import EmptyState from "@/components/ui/EmptyState";

// --- MOCK DATA ---
const WALLET_BALANCE: number = 10000;

const MOCK_SUBSCRIPTIONS: any[] = [
  {
    id: "sub_pro_1",
    planName: "Studio Pro Plan",
    price: 4900,
    interval: "month",
    status: "active",
    nextBillingDate: "July 1, 2026",
    paymentMethod: "Visa ending in 4242",
    features: [
      "Unlimited active escrow projects",
      "0% marketplace transaction fees",
      "Priority 24/7 customer support",
      "Advanced analytics & reporting",
      "Custom brand identity guidelines"
    ]
  }
];

export default function WalletPage() {
  const router = useRouter();
    const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  
  // Format currency dynamically
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="flex flex-col w-full px-[20px] lg:px-0 pb-[40px]">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[30px] w-full">
        
        {/* WALLET BALANCE CARD */}
        <div className="lg:col-span-1 flex flex-col w-full bg-black/10 backdrop-blur-xl border border-white/30 rounded-[30px] lg:rounded-[40px] p-8 shadow-xl shadow-primary-blue/5 h-fit">

          {WALLET_BALANCE === 0 ? (
            /* EMPTY STATE */
            <div className="py-[24px]">
              <EmptyState
                icon={<FiCreditCard size={32} />}
                title="Wallet Management"
                description="Fund your wallet, view balance, and manage payment methods."
                actionLabel="Add Funds"
                onAction={() => setIsAddFundsOpen(true)}
              />
            </div>
          ) : (
            /* POPULATED WALLET STATE */
            <>
          
              <div className="flex items-center justify-between w-full mb-[24px]">
                <div className="w-[48px] h-[48px] bg-primary-green/20 border border-primary-green/20 rounded-full flex items-center justify-center">
                  <FiCreditCard className="text-primary-green" size={24} />
                </div>
                <div className="bg-primary-green/10 border border-primary-green/20 px-[12px] py-[4px] rounded-full">
                  <span className="font-raleway font-medium text-[12px] text-primary-green">
                    Active
                  </span>
                </div>
              </div>

              <div className="flex flex-col mb-[32px]">
                <span className="font-raleway font-medium text-[15px] text-white/60 mb-[8px]">
                  Available Balance
                </span>
                <span className="font-raleway font-bold text-[36px] lg:text-[42px] leading-[1.1] text-white tracking-tight">
                  {formatCurrency(WALLET_BALANCE)}
                </span>
              </div>

              <div className="flex flex-col gap-[12px] w-full mt-auto">
                <button
                  onClick={() => setIsAddFundsOpen(true)}
                  className="w-full h-[48px] flex items-center justify-center gap-[8px] bg-primary-green hover:bg-accent-green-bright/30 transition-colors rounded-full shadow-[0_4px_14px_rgba(115,191,68,0.3)]">
                  <FiPlus className="text-white" size={18} />
                  <span className="font-raleway font-semibold text-[16px] text-white">
                    Add Funds
                  </span>
                </button>
            
                <button
                  onClick={() => router.push('/payment/withdrawals')}
                  className="w-full h-[48px] flex items-center justify-center gap-[8px] bg-black/10 hover:bg-accent-green-bright/30 border border-white/30 transition-colors rounded-full">
                  <FiArrowUpRight className="text-white" size={18} />
                  <span className="font-raleway font-medium text-[16px] text-white">
                    Withdraw
                  </span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* SUBSCRIPTIONS CARD - Mostly a placeholder till designs come in */}
        <div className="lg:col-span-2 flex flex-col w-full h-full">
          {MOCK_SUBSCRIPTIONS.length === 0 ? (
            <EmptyState 
              icon={<FiPackage size={32} strokeWidth={1.5} />}
              title="No Active Subscriptions"
              description="Manage your active subscriptions and view renewal dates."
              actionLabel="View Pricing Plans"
              onAction={() => console.log("Navigate to pricing")}
            />
          ) : (
            <>
              {MOCK_SUBSCRIPTIONS.map((sub) => (
                <div 
                  key={sub.id} 
                  className="flex flex-col w-full bg-black/10 backdrop-blur-xl border border-white/30 rounded-[30px] lg:rounded-[40px] p-[32px] lg:p-[40px] shadow-xl shadow-primary-blue/5"
                >
                  
                  {/* Top Row: Plan Title & Pricing */}
                  <div className="flex flex-col md:flex-row md:items-start justify-between w-full gap-[20px] mb-[32px] pb-[32px] border-b border-white/40">
                    
                    <div className="flex items-start gap-[16px]">
                      <div className="w-[56px] h-[56px] bg-gradient-to-br from-primary-blue/30 to-primary-green/30 border border-primary-green/20 rounded-[16px] flex items-center justify-center shrink-0 shadow-sm">
                        <FiZap className="text-primary-green" size={28} />
                      </div>
                      
                      <div className="flex flex-col gap-[4px]">
                        <h3 className="font-raleway font-bold text-[22px] lg:text-[26px] leading-[30px] text-white">
                          {sub.planName}
                        </h3>
                        <div className="flex items-center gap-[8px]">
                          <span className="flex items-center gap-[6px] font-raleway font-medium text-[14px] text-white/60">
                            <span className="w-[8px] h-[8px] bg-primary-green rounded-full shadow-[0_0_8px_rgba(115,191,68,0.6)]"></span>
                            Active Plan
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:items-end">
                      <div className="flex items-end gap-[4px]">
                        <span className="font-raleway font-bold text-[32px] leading-[32px] text-white">
                          {formatCurrency(sub.price)}
                        </span>
                        <span className="font-raleway font-medium text-[16px] text-white/50 mb-[2px]">
                          / {sub.interval}
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Middle Row: Features & Details */}
                  <div className="flex flex-col lg:flex-row w-full gap-[40px] mb-[40px]">
                    
                    {/* Features List */}
                    <div className="flex-1 flex flex-col gap-[16px]">
                      <h4 className="font-raleway font-semibold text-[16px] text-white">
                        Plan Features
                      </h4>
                      <div className="flex flex-col gap-[12px]">
                        {sub.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-[10px]">
                            <FiCheckCircle className="text-primary-green shrink-0 mt-[2px]" size={18} />
                            <span className="font-raleway font-normal text-[15px] text-white/80">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Billing Details */}
                    <div className="flex-1 flex flex-col gap-[24px] bg-white/20 border border-white/40 rounded-[24px] p-[24px]">
                      <div className="flex flex-col gap-[4px]">
                        <span className="font-raleway font-medium text-[14px] text-white/60">
                          Next Billing Date
                        </span>
                        <span className="font-raleway font-semibold text-[16px] text-white">
                          {sub.nextBillingDate}
                        </span>
                      </div>
                      
                      <div className="flex flex-col gap-[4px]">
                        <span className="font-raleway font-medium text-[14px] text-white/60">
                          Payment Method
                        </span>
                        <div className="flex items-center gap-[8px]">
                          <FiCreditCard className="text-primary-green/70" size={16} />
                          <span className="font-raleway font-semibold text-[16px] text-white">
                            {sub.paymentMethod}
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Bottom Row: Actions */}
                  <div className="flex flex-col sm:flex-row items-center gap-[16px] w-full mt-auto">
                    <button className="w-full sm:w-auto px-[32px] h-[48px] flex items-center justify-center gap-[8px] bg-primary-blue hover:bg-[#1a3f7a] transition-colors rounded-full shadow-md">
                      <FiSettings className="text-white" size={18} />
                      <span className="font-raleway font-semibold text-[16px] text-white">
                        Manage Plan
                      </span>
                    </button>
                    
                    <button className="w-full sm:w-auto px-[32px] h-[48px] flex items-center justify-center bg-white/40 hover:bg-white/70 border border-white/60 transition-colors rounded-full">
                      <span className="font-raleway font-medium text-[16px] text-accent-red-alt">
                        Cancel Subscription
                      </span>
                    </button>
                  </div>

                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* OVERLAY */}
            <AddFundsOverlay 
              isOpen={isAddFundsOpen} 
              onClose={() => setIsAddFundsOpen(false)} 
              onAdd={(amount) => {
                console.log(`Added: ${amount}`);
              }} 
      />
      
    </div>
  );
}