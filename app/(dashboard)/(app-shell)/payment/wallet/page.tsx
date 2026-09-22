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
  FiZap,
  FiX,
  FiLoader
} from "react-icons/fi";
import AddFundsOverlay from "@/components/features/wallet/AddFunds";
import EmptyState from "@/components/ui/EmptyState";
import { useSubscription } from "@/hooks/subscription/useSubscription";
import Button from "@/components/ui/Button";
import { usePayment } from "@/hooks/payment/usePayment";

// --- TIER DATA (Matches PDF) ---
const TIERS = {
  BASIC: {
    name: "Basic",
    priceMonthly: 0,
    priceAnnual: 0,
    features: ["Send up to 2 job briefs per month", "500 MB file storage", "10% platform fee on transactions", "Verified identity + portfolio profile"]
  },
  ADVANCE: {
    name: "Advance",
    priceMonthly: 5000,
    priceAnnual: 4000,
    features: ["Send up to 10 job briefs per month", "5 GB file storage", "7% platform fee (save 3%)", "Boosted search listing"]
  },
  PRO: {
    name: "Pro",
    priceMonthly: 12000,
    priceAnnual: 9600,
    features: ["Unlimited job briefs per month", "25 GB file storage", "5% platform fee (save 5%)", "Priority listing + 'Pro' badge", "Sell beats & stems on marketplace"]
  },
  ELITE: {
    name: "Elite",
    priceMonthly: 25000,
    priceAnnual: 20000,
    features: ["Top placement in discovery", "100 GB file storage", "3% platform fee (lowest available)", "Faster payout processing", "Dedicated account manager"]
  }
};

export default function WalletPage() {
  const router = useRouter();
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);

  const WALLET_BALANCE = 0; // To be properly implemented
  
    // Subscription State & Mutations
  const { useMySubscription, useSubscribe, useCancelSubscription, useReactivateSubscription } = useSubscription();
  const { data: subscription, isLoading: isSubLoading } = useMySubscription();
    
  const subscribeMutation = useSubscribe();
  const cancelMutation = useCancelSubscription();
  const reactivateMutation = useReactivateSubscription();
  
  const [isManagePlanOpen, setIsManagePlanOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"MONTHLY" | "ANNUAL">("MONTHLY");
  
  // Format currency dynamically
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleSubscribe = async (tier: "ADVANCE" | "PRO" | "ELITE") => {
      try {
        await subscribeMutation.mutateAsync({ tier, billingCycle });
        setIsManagePlanOpen(false);
      } catch (err) {
        console.error(err);
      }
    };
  
    // Derive current plan details
    const activePlanKey = (subscription?.tier?.toUpperCase() || "BASIC") as keyof typeof TIERS;
    const activePlanData = TIERS[activePlanKey];
    const currentPrice = subscription?.billingCycle === "ANNUAL" ? activePlanData.priceAnnual : activePlanData.priceMonthly;
    const hasActiveSub = subscription && subscription.status !== "CANCELED" && activePlanKey !== "BASIC";

  return (
    <div className="flex flex-col w-full px-5 lg:px-0 pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7.5 w-full">
        
        {/* WALLET BALANCE CARD */}
        <div className="lg:col-span-1 flex flex-col w-full bg-black/10 backdrop-blur-xl border border-white/30 rounded-[30px] lg:rounded-[40px] p-8 shadow-xl shadow-primary-blue/5 h-fit">

          {WALLET_BALANCE === 0 ? (
            /* EMPTY STATE */
            <div className="py-6">
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
          
              <div className="flex items-center justify-between w-full mb-6">
                <div className="w-12 h-12 bg-primary-green/20 border border-primary-green/20 rounded-full flex items-center justify-center">
                  <FiCreditCard className="text-primary-green" size={24} />
                </div>
                <div className="bg-primary-green/10 border border-primary-green/20 px-3 py-1 rounded-full">
                  <span className="font-raleway font-medium text-[12px] text-primary-green">
                    Active
                  </span>
                </div>
              </div>

              <div className="flex flex-col mb-8">
                <span className="font-raleway font-medium text-[15px] text-white/60 mb-2">
                  Available Balance
                </span>
                <span className="font-raleway font-bold text-[36px] lg:text-[42px] leading-[1.1] text-white tracking-tight">
                  {formatCurrency(WALLET_BALANCE)}
                </span>
              </div>

              <div className="flex flex-col gap-3 w-full mt-auto">
                <button
                  onClick={() => setIsAddFundsOpen(true)}
                  className="w-full h-12 flex items-center justify-center gap-2 bg-primary-green hover:bg-accent-green-bright/30 transition-colors rounded-full shadow-[0_4px_14px_rgba(115,191,68,0.3)]">
                  <FiPlus className="text-white" size={18} />
                  <span className="font-raleway font-semibold text-[16px] text-white">
                    Add Funds
                  </span>
                </button>
            
                <button
                  onClick={() => router.push('/payment/withdrawals')}
                  className="w-full h-12 flex items-center justify-center gap-2 bg-black/10 hover:bg-accent-green-bright/30 border border-white/30 transition-colors rounded-full">
                  <FiArrowUpRight className="text-white" size={18} />
                  <span className="font-raleway font-medium text-[16px] text-white">
                    Withdraw
                  </span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* SUBSCRIPTIONS CARD */}
                <div className="lg:col-span-2 flex flex-col w-full h-full">
                  {isSubLoading ? (
                    <div className="w-full h-full min-h-75 flex items-center justify-center bg-black/10 border border-white/30 rounded-[30px] lg:rounded-[40px]">
                      <FiLoader className="animate-spin text-primary-green" size={32} />
                    </div>
                  ) : !hasActiveSub ? (
                    <EmptyState 
                      icon={<FiPackage size={32} strokeWidth={1.5} />}
                      title="No Active Subscriptions"
                      description="You are currently on the Basic tier. Upgrade to unlock more features."
                      actionLabel="View Pricing Plans"
                      onAction={() => setIsManagePlanOpen(true)}
                    />
                  ) : (
                    <div className="flex flex-col w-full bg-black/10 backdrop-blur-xl border border-white/30 rounded-[30px] lg:rounded-[40px] p-8 lg:p-10 shadow-xl shadow-primary-blue/5">
                      
                      {/* Top Row: Plan Title & Pricing */}
                      <div className="flex flex-col md:flex-row md:items-start justify-between w-full gap-5 mb-8 pb-8 border-b border-white/40">
                        <div className="flex items-start gap-[16px]">
                          <div className="w-14 h-14 bg-linear-to-br from-primary-blue/30 to-primary-green/30 border border-primary-green/20 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                            <FiZap className="text-primary-green" size={28} />
                          </div>
                          <div className="flex flex-col gap-1">
                            <h3 className="font-raleway font-bold text-[22px] lg:text-[26px] leading-7.5 text-white">
                              {activePlanData.name} Tier
                            </h3>
                            <div className="flex items-center gap-2">
                              <span className="flex items-center gap-1.5 font-raleway font-medium text-[14px] text-white/60">
                                <span className={`w-2 h-2 rounded-full ${subscription?.status === "ACTIVE" ? "bg-primary-green shadow-[0_0_8px_rgba(115,191,68,0.6)]" : "bg-red-400"}`}></span>
                                {subscription?.cancelAtPeriodEnd ? "Canceling at Period End" : "Active Plan"}
                              </span>
                            </div>
                          </div>
                        </div>
        
                        <div className="flex flex-col md:items-end">
                          <div className="flex items-end gap-1">
                            <span className="font-raleway font-bold text-[32px] leading-8 text-white">
                              {formatCurrency(currentPrice)}
                            </span>
                            <span className="font-raleway font-medium text-[16px] text-white/50 mb-0.5">
                              / mo {subscription?.billingCycle === "ANNUAL" && "(Billed Annually)"}
                            </span>
                          </div>
                        </div>
                      </div>
        
                      {/* Middle Row: Features & Details */}
                      <div className="flex flex-col lg:flex-row w-full gap-10 mb-10">
                        <div className="flex-1 flex flex-col gap-4">
                          <h4 className="font-raleway font-semibold text-[16px] text-white">Plan Features</h4>
                          <div className="flex flex-col gap-3">
                            {activePlanData.features.map((feature: string, idx: number) => (
                              <div key={idx} className="flex items-start gap-2.5">
                                <FiCheckCircle className="text-primary-green shrink-0 mt-0.5" size={18} />
                                <span className="font-raleway font-normal text-[15px] text-white/80">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
        
                        <div className="flex-1 flex flex-col gap-6 bg-white/20 border border-white/40 rounded-6 p-6">
                          <div className="flex flex-col gap-1">
                            <span className="font-raleway font-medium text-[14px] text-white/60">Next Billing Date</span>
                            <span className="font-raleway font-semibold text-[16px] text-white">
                              {subscription?.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString() : "N/A"}
                            </span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="font-raleway font-medium text-[14px] text-white/60">Payment Method</span>
                            <div className="flex items-center gap-2">
                              <FiCreditCard className="text-primary-green/70" size={16} />
                              <span className="font-raleway font-semibold text-[16px] text-white">
                                Default Saved Card
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
        
                      {/* Bottom Row: Actions */}
                      <div className="flex flex-col sm:flex-row items-center gap-4 w-full mt-auto">
                        <button 
                          onClick={() => setIsManagePlanOpen(true)}
                          className="w-full sm:w-auto px-8 h-12 flex items-center justify-center gap-2 bg-primary-blue hover:bg-accent-blue transition-colors rounded-full shadow-md"
                        >
                          <FiSettings className="text-white" size={18} />
                          <span className="font-raleway font-semibold text-[16px] text-white">
                            Manage Plan
                          </span>
                        </button>
                        
                        {subscription?.cancelAtPeriodEnd ? (
                          <button 
                            disabled={reactivateMutation.isPending}
                            onClick={() => reactivateMutation.mutate()}
                            className="w-full sm:w-auto px-8 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 border border-primary-green transition-colors rounded-full"
                          >
                            <span className="font-raleway font-medium text-[16px] text-primary-green">
                              {reactivateMutation.isPending ? "Reactivating..." : "Reactivate Subscription"}
                            </span>
                          </button>
                        ) : (
                          <button 
                            disabled={cancelMutation.isPending}
                            onClick={() => cancelMutation.mutate()}
                            className="w-full sm:w-auto px-8 h-12 flex items-center justify-center bg-white/5 hover:bg-red-400/10 border border-white/20 hover:border-red-400/50 transition-colors rounded-full"
                          >
                            <span className="font-raleway font-medium text-[16px] text-white/60 hover:text-red-400">
                              {cancelMutation.isPending ? "Canceling..." : "Cancel Subscription"}
                            </span>
                          </button>
                        )}
                      </div>
        
                    </div>
                  )}
                </div>
              </div>
        
              {/* MANAGE PLAN MODAL */}
              {isManagePlanOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
                  <div className="w-full max-w-5xl bg-[#1A1D26] border border-white/10 rounded-[35px] p-6 lg:p-10 flex flex-col gap-6 relative shadow-2xl my-8">
                    
                    <button 
                      onClick={() => setIsManagePlanOpen(false)}
                      className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors"
                    >
                      <FiX size={24} />
                    </button>
        
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
                       <h3 className="font-raleway font-semibold text-[24px] text-white">Choose a Plan</h3>
                       <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-1">
                         <button 
                           onClick={() => setBillingCycle("MONTHLY")}
                           className={`px-4 py-1.5 rounded-full font-inter text-[13px] font-semibold transition-colors ${billingCycle === "MONTHLY" ? "bg-white/10 text-white" : "text-white/50 hover:text-white"}`}
                         >
                           Monthly
                         </button>
                         <button 
                           onClick={() => setBillingCycle("ANNUAL")}
                           className={`px-4 py-1.5 rounded-full font-inter text-[13px] font-semibold transition-colors flex items-center gap-2 ${billingCycle === "ANNUAL" ? "bg-white/10 text-white" : "text-white/50 hover:text-white"}`}
                         >
                           Annually <span className="text-primary-green text-[10px] bg-primary-green/10 px-2 py-0.5 rounded-full">Save 20%</span>
                         </button>
                       </div>
                    </div>
        
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {(["ADVANCE", "PRO", "ELITE"] as const).map((tierKey) => {
                        const tier = TIERS[tierKey];
                        const price = billingCycle === "ANNUAL" ? tier.priceAnnual : tier.priceMonthly;
                        const isCurrentPlan = activePlanKey === tierKey;
        
                        return (
                          <div key={tierKey} className={`rounded-3xl p-6 border flex flex-col justify-between transition-all ${tierKey === "PRO" ? "bg-linear-to-b from-primary-green/10 to-transparent border-primary-green/30" : "bg-black/40 border-white/10"}`}>
                            <div>
                              {tierKey === "PRO" && <span className="bg-primary-green text-black font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full mb-4 inline-block">Most Popular</span>}
                              
                              <h4 className="font-raleway text-[20px] font-bold text-white mb-2">{tier.name}</h4>
                              <span className="font-raleway text-[32px] font-extrabold text-white">
                                {formatCurrency(price)}
                                <span className="text-[14px] font-normal text-white/50">/mo</span>
                              </span>
                              {billingCycle === "ANNUAL" && (
                                 <p className="text-[11px] text-primary-green mt-1">Billed as {formatCurrency(price * 12)}/year</p>
                              )}
        
                              <div className="flex flex-col gap-3 mt-6">
                                 {tier.features.slice(0, 3).map((f, i) => (
                                    <div key={i} className="flex items-start gap-2">
                                      <FiCheckCircle className="text-primary-green shrink-0 mt-0.5" size={14} />
                                      <span className="font-inter text-[12px] text-white/70">{f}</span>
                                    </div>
                                 ))}
                              </div>
                            </div>
        
                            <Button
                              onClick={() => handleSubscribe(tierKey)}
                              disabled={isCurrentPlan || subscribeMutation.isPending}
                              className={`mt-8 w-full rounded-full py-3 h-auto ${isCurrentPlan ? "bg-white/10 text-white/40" : (tierKey === "PRO" ? "bg-primary-green text-white" : "bg-white/5 border border-white/20 text-white hover:bg-white/10")}`}
                            >
                              {isCurrentPlan ? "Current Plan" : "Select Plan"}
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
        
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