"use client";

import React, { useState } from "react";
import { HiOutlineX, HiOutlineCurrencyDollar } from "react-icons/hi";

interface ManualPayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: { userId: string; amount: number; reason: string }) => Promise<boolean>;
}

export const ManualPayoutModal: React.FC<ManualPayoutModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !amount || !reason) return;
    setIsSubmitting(true);
    const success = await onSubmit({
      userId,
      amount: parseFloat(amount),
      reason,
    });
    setIsSubmitting(false);
    if (success) {
      setUserId("");
      setAmount("");
      setReason("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#121415] border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        >
          <HiOutlineX size={20} />
        </button>

        <div className="flex items-center gap-4 border-b border-white/10 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-green/10 border border-primary-green/20 text-primary-green flex items-center justify-center">
            <HiOutlineCurrencyDollar size={28} />
          </div>
          <div className="flex flex-col">
            <h3 className="text-lg font-bold text-white font-sans">Process Manual Payout</h3>
            <p className="text-xs text-text-muted">Disburse manual wallet or bank payout to a verified platform user.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-white/80">User ID / Email</label>
            <input
              type="text"
              required
              placeholder="e.g. usr_98421 or user@collabden.com"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-primary-green transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-white/80">Payout Amount ($ USD)</label>
            <input
              type="number"
              step="0.01"
              required
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-primary-green transition-colors font-mono"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-white/80">Reason / Reference Note</label>
            <textarea
              required
              rows={3}
              placeholder="Specify justification for manual payout disbursement..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-primary-green transition-colors"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-primary-green text-text-main text-xs font-bold hover:brightness-110 transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Processing..." : "Confirm & Disburse Payout"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
