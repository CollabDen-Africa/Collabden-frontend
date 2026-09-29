"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import { FiCreditCard, FiDownload, FiLoader, FiPlus, FiTrash, FiCheckCircle, FiDatabase } from "react-icons/fi";
import { useSubscription } from "@/hooks/subscription/useSubscription";

// --- TIER DATA ---
const TIERS = {
  BASIC: {
    name: "Basic",
    priceMonthly: 0,
    priceAnnual: 0,
    storageGB: 0.5, // 500MB
    features: ["Send up to 2 job briefs per month", "500 MB file storage", "10% platform fee on transactions", "Verified identity + portfolio profile"]
  },
  ADVANCE: {
    name: "Advance",
    priceMonthly: 5000,
    priceAnnual: 4000,
    storageGB: 5,
    features: ["Send up to 10 job briefs per month", "5 GB file storage", "7% platform fee (save 3%)", "Boosted search listing"]
  },
  PRO: {
    name: "Pro",
    priceMonthly: 12000,
    priceAnnual: 9600,
    storageGB: 25,
    features: ["Unlimited job briefs per month", "25 GB file storage", "5% platform fee (save 5%)", "Priority listing + 'Pro' badge", "Sell beats & stems on marketplace"]
  },
  ELITE: {
    name: "Elite",
    priceMonthly: 25000,
    priceAnnual: 20000,
    storageGB: 100,
    features: ["Top placement in discovery", "100 GB file storage", "3% platform fee (lowest available)", "Faster payout processing", "Dedicated account manager"]
  }
};

export default function ProfileSettingsSubscriptions() {
  const {
    useMySubscription,
    useSubscribe,
    useCancelSubscription,
    useReactivateSubscription,
    useBillingHistory,
    usePaymentMethods,
    useSavePaymentMethod,
    useSetDefaultPaymentMethod,
    useRemovePaymentMethod
  } = useSubscription();

  const { data: subscription, isLoading: isSubLoading } = useMySubscription();
  const { data: billing = { invoices: [], total: 0 } } = useBillingHistory(1, 10);
  const { data: cards = [] } = usePaymentMethods();

  const subscribeMutation = useSubscribe();
  const cancelMutation = useCancelSubscription();
  const reactivateMutation = useReactivateSubscription();
  const addCardMutation = useSavePaymentMethod();
  const deleteCardMutation = useRemovePaymentMethod();
  const setDefaultCardMutation = useSetDefaultPaymentMethod();

  // UI Toggles
  const [activeView, setActiveView] = useState<"OVERVIEW" | "UPGRADE" | "PAYMENT">("OVERVIEW");
  const [billingCycle, setBillingCycle] = useState<"MONTHLY" | "ANNUAL">("MONTHLY");
  const [showAddCard, setShowAddCard] = useState(false);

  // Card Inputs
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardBrand, setCardBrand] = useState("Visa");

  // Format currency dynamically for Naira
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber.trim() || !cardExpiry.trim()) return;

    const [month, year] = cardExpiry.split("/").map(Number);
    try {
      await addCardMutation.mutateAsync({
        token: `tok_${Math.random().toString(36).substr(2, 9)}`,
        last4: cardNumber.slice(-4),
        brand: cardBrand,
        expMonth: month || 12,
        expYear: year ? (year < 100 ? 2000 + year : year) : 2030,
        type: "CARD",
      });
      setShowAddCard(false);
      setCardNumber("");
      setCardExpiry("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubscribe = async (tier: "ADVANCE" | "PRO" | "ELITE") => {
    try {
      await subscribeMutation.mutateAsync({ tier, billingCycle });
      setActiveView("OVERVIEW");
    } catch (err) {
      console.error(err);
    }
  };

  const activePlanKey = (subscription?.tier?.toUpperCase() || "BASIC") as keyof typeof TIERS;
  const activePlanData = TIERS[activePlanKey];
  const statusColorClass = subscription?.status === "ACTIVE" ? "text-primary-green" : "text-red-400";

  
  // Mocking storage usage for the UI (e.g., 72% used)
  const usedStorageGB = (subscription as any)?.usedStorageGB || 0; 
  const storagePercentage = activePlanData.storageGB > 0 
    ? Math.min((usedStorageGB /activePlanData.storageGB) * 100, 100) 
    : 0;

  if (isSubLoading) {
    return (
      <div className="w-full flex items-center justify-center py-20 text-white">
        <FiLoader className="animate-spin text-primary-green" size={32} />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full flex-1 gap-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col gap-1.5 mb-2">
        <h1 className="font-raleway font-semibold text-[26.4px] leading-8.5 text-[#E8EDF0]">
          Subscription & Billing
        </h1>
        <p className="font-raleway font-normal text-[20.5px] leading-7.25 text-white/50">
          Manage your plan, usage, and payment details
        </p>
      </div>

      {/* Current Plan Card */}
      <div className="w-full bg-white/10 border-[1.6px] border-primary-green/20 rounded-[35px] p-8.75 flex flex-col gap-7 backdrop-blur-md">
        
        {/* Top Section: Plan Info & Badge */}
        <div className="flex flex-col sm:flex-row justify-between items-start w-full gap-6">
          <div className="flex flex-col">
            <span className="font-raleway font-semibold text-[17.6px] text-primary-green mb-1.5">
              {activePlanData.name} Tier
            </span>
            <span className="font-raleway font-bold text-[35.2px] text-white leading-none mb-2">
              {activePlanKey === "BASIC" 
                ? "Free" 
                : `${formatCurrency(subscription?.billingCycle === "ANNUAL" ? activePlanData.priceAnnual : activePlanData.priceMonthly)}/mo`
              }
            </span>
            {subscription && (
              <span className="font-raleway font-normal text-[17.6px] text-white/50">
                Renews {new Date(subscription.currentPeriodEnd).toLocaleDateString()} · {subscription.billingCycle.toLowerCase()} billing
              </span>
             )}
          </div>
          
          <div className="flex items-center gap-4 bg-accent-green-bright/5 border border-border-muted/25 rounded-full px-4 py-1.5">
            <div className={`w-[8.8px] h-[8.8px] rounded-full ${subscription?.status === "ACTIVE" ? "bg-accent-green-success" : "bg-red-400"}`} />
                <span className={`font-raleway font-normal text-[17.6px] ${statusColorClass}`}>
                        {subscription?.status || "Free Account"}
                </span>
            </div>
          </div>


        {/* Middle Section: Storage Progress */}
        <div className="flex flex-col gap-[11.7px] mt-1 w-full">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-[8.8px] text-white/50">
              <FiDatabase size={17.6} />
              <span className="font-raleway font-normal text-[17.6px]">Storage</span>
            </div>
            <span className="font-raleway font-normal text-[17.6px] text-white/80">
              {usedStorageGB} gb/{activePlanData.storageGB} gb
            </span>
          </div>
          {/* Progress Bar */}
          <div className="w-full h-[11.7px] bg-white/10 rounded-full overflow-hidden">
             <div 
               className="h-full bg-primary-green rounded-full transition-all duration-1000 ease-out" 
               style={{ width: `${storagePercentage}%` }}
             />
          </div>
        </div>

        {/* Bottom Section: Buttons */}
        <div className="flex flex-row flex-wrap items-center gap-6 mt-6">
          <button
            onClick={() => setActiveView(activeView === "UPGRADE" ? "OVERVIEW" : "UPGRADE")}
            className="flex flex-col justify-center items-center px-[23.5px] py-[11.7px] h-[53.5px] bg-primary-green rounded-[35px] font-raleway font-semibold text-[20.5px] text-white hover:bg-primary-green/90 transition-colors shadow-lg shadow-primary-green/20"
          >
            Upgrade Plan
          </button>

          <button
            onClick={() => setActiveView(activeView === "PAYMENT" ? "OVERVIEW" : "PAYMENT")}
            className="flex flex-col justify-center items-center px-[23.5px] py-[11.7px] h-[56.7px] border-[1.6px] border-white/10 rounded-[35px] font-raleway font-medium text-[20.5px] text-[#E8EDF0] hover:bg-white/5 transition-colors"
          >
            Manage Payment
          </button>

          {subscription?.cancelAtPeriodEnd ? (
            <button
              disabled={reactivateMutation.isPending}
              onClick={() => reactivateMutation.mutate()}
              className="flex flex-col justify-center items-center px-[23.5px] py-[11.7px] h-[53.5px] rounded-[23.5px] font-raleway font-medium text-[20.5px] text-primary-green hover:bg-primary-green/10 transition-colors ml-auto"
            >
              Reactivate Plan
            </button>
          ) : (
            subscription && (
              <button
                disabled={cancelMutation.isPending}
                onClick={() => cancelMutation.mutate()}
                className="flex flex-col justify-center items-center px-[23.5px] py-[11.7px] h-[53.5px] rounded-[23.5px] font-raleway font-medium text-[20.5px] text-white/50 hover:text-red-400 hover:bg-red-400/10 transition-colors ml-auto"
              >
                Cancel Plan
              </button>
            )
          )}
        </div>
      </div>

      {/* --- HIDDEN VIEW: UPGRADE PLANS --- */}
      {activeView === "UPGRADE" && (
        <div className="w-full bg-black/20 border border-white/10 rounded-[35px] p-8 flex flex-col gap-6 animate-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
             <h3 className="font-raleway font-semibold text-[22px] text-white">Choose a Plan</h3>
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
            {(["ADVANCE", "PRO", "ELITE"] as const).map((tierKey) => {
              const tier = TIERS[tierKey];
              const price = billingCycle === "ANNUAL" ? tier.priceAnnual : tier.priceMonthly;
              const isCurrentPlan = activePlanKey === tierKey;

              return (
                <div key={tierKey} className={`rounded-[25px] p-6 border flex flex-col justify-between transition-all ${tierKey === "PRO" ? "bg-linear-to-b from-primary-green/10 to-transparent border-primary-green/30" : "bg-black/40 border-white/10"}`}>
                  <div>
                    {tierKey === "PRO" && <span className="bg-primary-green text-black font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full mb-4 inline-block">Most Popular</span>}
                    <h4 className="font-raleway text-[20px] font-bold text-white mb-2">{tier.name}</h4>
                    <span className="font-raleway text-[32px] font-extrabold text-white">
                      {formatCurrency(price)}<span className="text-[14px] font-normal text-white/50">/mo</span>
                    </span>
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
      )}

      {/* --- HIDDEN VIEW: MANAGE PAYMENT --- */}
      {activeView === "PAYMENT" && (
        <div className="w-full flex flex-col gap-8 animate-in slide-in-from-top-4 duration-300">
          
          {/* Saved Cards */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center w-full">
              <h2 className="font-raleway font-medium text-[20.5px] text-white">Payment Methods</h2>
              <Button variant="outline" onClick={() => setShowAddCard(!showAddCard)} className="flex items-center gap-1.5 rounded-full border-white/10 px-4 py-1.5 h-auto text-[15px] hover:bg-white/5 text-white/80">
                <FiPlus size={16} /> Add Card
              </Button>
            </div>

            {/* Add Card Form */}
            {showAddCard && (
              <form onSubmit={handleAddCard} className="bg-white/5 border border-white/10 rounded-[25px] p-6 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 col-span-2">
                    <label className="text-[14px] text-white/70">Card Number</label>
                    <input type="text" required placeholder="4242 4242 4242 4242" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} className="w-full h-11.25 rounded-xl bg-black/20 border border-white/10 px-4 text-white outline-none focus:border-primary-green" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[14px] text-white/70">Expiry Date</label>
                    <input type="text" required placeholder="MM/YY" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} className="w-full h-11.25 rounded-xl bg-black/20 border border-white/10 px-4 text-white outline-none focus:border-primary-green" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[14px] text-white/70">Brand</label>
                    <select value={cardBrand} onChange={(e) => setCardBrand(e.target.value)} className="w-full h-11.25 rounded-xl bg-black/30 border border-white/10 px-4 text-white outline-none focus:border-primary-green">
                      <option value="Visa">Visa</option>
                      <option value="Mastercard">Mastercard</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button type="submit" className="bg-primary-green text-white px-6 rounded-full">Save Card</Button>
                  <Button variant="outline" onClick={() => setShowAddCard(false)} className="text-white border-white/10 rounded-full hover:bg-white/5">Cancel</Button>
                </div>
              </form>
            )}

            {/* Card List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cards.length === 0 ? (
                <div className="col-span-2 bg-white/5 border border-white/10 rounded-[25px] p-7 text-center text-white/40 font-inter">
                  No saved cards found. Add a card to get started.
                </div>
              ) : (
                cards.map((card) => (
                  <div key={card.id} className="bg-white/5 border border-white/10 rounded-[25px] p-6 flex flex-col gap-4 backdrop-blur-md">
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shrink-0">
                        <FiCreditCard size={22} className="text-primary-green" />
                      </div>
                      {card.isDefault && <span className="bg-primary-green/10 text-primary-green text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full">Default</span>}
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="font-raleway font-semibold text-[18px] text-white">
                        {card.brand} •••• {card.last4}
                      </span>
                      <span className="font-inter font-normal text-[14px] text-white/50 mt-1">Expires {card.expMonth}/{card.expYear}</span>
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-white/5">
                      {!card.isDefault && (
                        <Button
                            variant="outline"
                            onClick={() => setDefaultCardMutation.mutate(card.id)}
                            className="rounded-[18px] px-4 py-2 h-auto text-[14px]"
                        >
                              Set Default
                        </Button>

                      )}
                      <Button
                        variant="outline"
                        onClick={() => deleteCardMutation.mutate(card.id)}
                        className="rounded-[18px] px-4 py-2 h-auto text-[14px] text-red-400! border-red-400/20!"
                      >
                        <FiTrash size={16} />
                      </Button>

                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Billing History */}
          <div className="flex flex-col gap-4 mt-4">
            <h2 className="font-raleway font-medium text-[20.5px] text-white">Billing History</h2>
            <div className="w-full bg-white/5 border border-white/10 rounded-[25px] overflow-hidden backdrop-blur-md">
              {billing.invoices.length === 0 ? (
                <div className="p-8 text-center text-white/40 font-inter">No billing history found</div>
              ) : (
                billing.invoices.map((inv) => (
                  <div key={inv.id} className="flex justify-between items-center px-6 lg:px-8 py-5 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                    <div className="flex flex-col">
                      <span className="font-raleway font-semibold text-[16px] text-white">{inv.id}</span>
                      <span className="font-inter text-[13px] text-white/45">{new Date(inv.billingDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-4 lg:gap-6">
                      <span className="font-raleway font-bold text-[16px] text-white">{formatCurrency(inv.amount)}</span>
                      <div className="hidden sm:block bg-primary-green/10 border border-primary-green/20 rounded-full px-3 py-1">
                        <span className="text-[11px] text-primary-green font-semibold uppercase tracking-wider">{inv.status}</span>
                      </div>
                      <a href={`/api/proxy/subscriptions/billing/invoices/${inv.id}/pdf`} download className="text-white/40 hover:text-white transition-colors p-2">
                        <FiDownload size={18} />
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}