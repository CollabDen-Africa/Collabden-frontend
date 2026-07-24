"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import { FiCreditCard, FiDownload, FiLoader, FiPlus, FiTrash } from "react-icons/fi";
import { useSubscription } from "@/hooks/subscription/useSubscription";

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

  const [showPlansList, setShowPlansList] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);

  // Card Inputs
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardBrand, setCardBrand] = useState("Visa");

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
      await subscribeMutation.mutateAsync({ tier, billingCycle: "MONTHLY" });
      setShowPlansList(false);
    } catch (err) {
      console.error(err);
    }
  };

  const activePlanName = subscription?.tier || "BASIC";
  const statusColorClass = subscription?.status === "ACTIVE" ? "text-primary-green" : "text-red-400";

  if (isSubLoading) {
    return (
      <div className="w-full flex items-center justify-center py-20 text-white">
        <FiLoader className="animate-spin text-primary-green" size={32} />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full flex-1 gap-8.75 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <h1 className="font-raleway font-semibold text-[26.4px] leading-8.5 text-[#E8EDF0]">
          Subscription & Billing
        </h1>
        <p className="font-raleway font-normal text-[20.5px] leading-7.25 text-white/50">
          Manage your plan, usage, and payment details
        </p>
      </div>

      {/* Current Plan Card */}
      <div className="w-full bg-white/5 border border-border-muted/20 rounded-[35px] p-8.75 flex flex-col backdrop-blur-md">
        {/* Top Row: Plan info & Badge */}
        <div className="flex flex-row justify-between items-start w-full">
          <div className="flex flex-col">
            <span className="font-raleway font-semibold text-[17.6px] text-primary-green mb-1.5">
              {activePlanName.charAt(0) + activePlanName.slice(1).toLowerCase()} Tier
            </span>
            <span className="font-raleway font-bold text-[35.2px] text-white leading-none mb-1.5">
              {activePlanName === "BASIC" ? "Free" : activePlanName === "PRO" ? "$29/mo" : activePlanName === "ADVANCE" ? "$15/mo" : "$59/mo"}
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

        {/* Plan Actions */}
        <div className="flex flex-row flex-wrap gap-4 mt-8">
          <Button
            variant="primary"
            onClick={() => setShowPlansList(!showPlansList)}
            className="rounded-full px-6 py-3 h-auto text-[20.5px]"
          >
            Upgrade / Change Plan
          </Button>

          {subscription?.cancelAtPeriodEnd ? (
            <Button
              variant="outline"
              disabled={reactivateMutation.isPending}
              onClick={() => reactivateMutation.mutate()}
              className="rounded-full px-6 py-3 h-auto text-[20.5px] text-primary-green! border-primary-green!"
            >
              Reactivate Plan
            </Button>
          ) : (
            subscription && (
              <Button
                variant="ghost"
                disabled={cancelMutation.isPending}
                onClick={() => cancelMutation.mutate()}
                className="rounded-full px-6 py-3 h-auto text-[20.5px] text-text-muted! ml-auto"
              >
                Cancel Renewal
              </Button>
            )
          )}
        </div>
      </div>

      {/* Subscription Plans List Modal/Toggler */}
      {showPlansList && (
        <div className="w-full bg-white/10 border border-white/10 rounded-[35px] p-8 flex flex-col gap-6 animate-in slide-in-from-top-4 duration-300">
          <h3 className="font-raleway font-semibold text-[20px] text-white">Choose a Plan</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(["ADVANCE", "PRO", "ELITE"] as const).map((tier) => (
              <div key={tier} className="bg-black/20 rounded-2xl p-6 border border-white/5 flex flex-col justify-between">
                <div>
                  <h4 className="text-[18px] font-bold text-white mb-2">{tier}</h4>
                  <span className="text-[24px] font-extrabold text-white">
                    {tier === "ADVANCE" ? "$15" : tier === "PRO" ? "$29" : "$59"}
                    <span className="text-[14px] font-normal text-white/55">/mo</span>
                  </span>
                </div>
                <Button
                  onClick={() => handleSubscribe(tier)}
                  className="mt-6 bg-primary-green text-white w-full"
                >
                  Select Plan
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Cards Section */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center w-full">
          <h2 className="font-raleway font-medium text-[20.5px] text-white">Payment Methods</h2>
          <Button
            variant="outline"
            onClick={() => setShowAddCard(!showAddCard)}
            className="flex items-center gap-1.5 rounded-full border-white/10 px-4 py-1.5 h-auto text-[15px]"
          >
            <FiPlus size={16} /> Add Card
          </Button>
        </div>

        {showAddCard && (
          <form onSubmit={handleAddCard} className="bg-white/10 border border-white/10 rounded-[25px] p-6 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 col-span-2">
                <label className="text-[14px] text-white/70">Card Number</label>
                <input
                  type="text"
                  required
                  placeholder="4242 4242 4242 4242"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full h-[45px] rounded-xl bg-black/20 border border-white/10 px-4 text-white outline-none focus:border-primary-green"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[14px] text-white/70">Expiry Date</label>
                <input
                  type="text"
                  required
                  placeholder="MM/YY"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  className="w-full h-[45px] rounded-xl bg-black/20 border border-white/10 px-4 text-white outline-none focus:border-primary-green"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[14px] text-white/70">Brand</label>
                <select
                  value={cardBrand}
                  onChange={(e) => setCardBrand(e.target.value)}
                  className="w-full h-[45px] rounded-xl bg-black/30 border border-white/10 px-4 text-white outline-none focus:border-primary-green"
                >
                  <option value="Visa">Visa</option>
                  <option value="Mastercard">Mastercard</option>
                  <option value="American Express">Amex</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="bg-primary-green text-white px-6">Save Card</Button>
              <Button variant="outline" onClick={() => setShowAddCard(false)} className="text-white border-white/10">Cancel</Button>
            </div>
          </form>
        )}

        {cards.length === 0 ? (
          <div className="w-full bg-white/5 border border-white/10 rounded-3xl p-7 text-center text-white/40">
            No saved cards found. Add a card to get started.
          </div>
        ) : (
          cards.map((card) => (
            <div key={card.id} className="w-full bg-white/5 border border-white/10 rounded-3xl p-7 flex flex-row items-center gap-6 backdrop-blur-md">
              <div className="w-[58.6px] h-[58.6px] bg-primary-blue rounded-3xl flex items-center justify-center shrink-0">
                <FiCreditCard size={26} className="text-white" />
              </div>
              
              <div className="flex flex-col flex-1">
                <span className="font-raleway font-medium text-[20.5px] text-text-muted">
                  {card.brand} ending in {card.last4} {card.isDefault && "(Default)"}
                </span>
                <span className="font-raleway font-normal text-[17.6px] text-white/50">
                  Expires {card.expMonth}/{card.expYear}
                </span>
              </div>

              <div className="flex gap-2">
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

      {/* Billing History / Invoices */}
      <div className="flex flex-col gap-4">
        <h2 className="font-raleway font-medium text-[20.5px] text-white">Billing History</h2>
        <div className="w-full bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md">
          {billing.invoices.length === 0 ? (
            <div className="p-8 text-center text-white/40">No billing history found</div>
          ) : (
            billing.invoices.map((inv) => (
              <div key={inv.id} className="flex justify-between items-center px-8 py-5 border-b border-white/5 last:border-0">
                <div className="flex flex-col">
                  <span className="font-raleway font-semibold text-[17px] text-white">{inv.id}</span>
                  <span className="text-[14px] text-white/45">{new Date(inv.billingDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-raleway font-bold text-[18px] text-white">${inv.amount}</span>
                  <div className="bg-primary-green/10 border border-primary-green/20 rounded-full px-3 py-1">
                    <span className="text-[13px] text-primary-green font-medium">{inv.status}</span>
                  </div>
                  <a
                    href={`/api/proxy/subscriptions/billing/invoices/${inv.id}/pdf`}
                    download
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    <FiDownload size={18} />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}