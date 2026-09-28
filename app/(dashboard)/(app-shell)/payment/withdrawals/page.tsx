"use client";
import React, { useState, useEffect } from "react";
import {
  FiArrowDownCircle,
  FiCheckCircle,
  FiClock,
  FiDownload,
} from "react-icons/fi";
import Select from "@/components/ui/Select";
import { usePayment } from "@/hooks/payment/usePayment";

export default function WithdrawalsPage() {
  const [amount, setAmount] = useState<string>("");
  const [selectedBank, setSelectedBank] = useState<string>("");

  // Live Data Hooks
  const { useWallet, useBankAccounts, useWithdrawals, useWithdraw } = usePayment();
  const { data: wallet } = useWallet();
  const { data: bankData } = useBankAccounts();
  const { data: withdrawalsData } = useWithdrawals(1, 20);
  const withdrawMutation = useWithdraw();

  // Derived Data
  const AVAILABLE_BALANCE = wallet?.balance || 0;
  const banks = bankData || [];
  const recentWithdrawals = withdrawalsData?.withdrawals || [];

  // Format currency dynamically
  const formatCurrency = (val: number) => {
    const formatted = new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: wallet?.currency || "NGN",
      minimumFractionDigits: 2,
    }).format(Math.abs(val));
    return val < 0 ? `-${formatted}` : formatted;
  };

  // Status-based styling for the badges mapped to API enums
  const renderStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
      case "SUCCESSFUL":
        return (
          <div className="flex items-center gap-1.5 bg-accent-green-success/10 border border-accent-green-bright/20 px-3 py-1 rounded-full w-fit">
            <FiCheckCircle className="text-accent-green-success" size={14} />
            <span className="font-raleway font-medium text-[12px] lg:text-[14px] text-accent-green-success capitalize">
              Successful
            </span>
          </div>
        );
      case "PENDING":
      case "PROCESSING":
        return (
          <div className="flex items-center gap-1.5 bg-primary-blue/30 border border-primary-blue/20 px-3 py-1 rounded-full w-fit">
            <FiClock className="text-secondary-blue" size={14} />
            <span className="font-raleway font-medium text-[12px] lg:text-[14px] text-secondary-blue capitalize">
              Processing
            </span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5 bg-white/10 border border-white/20 px-3 py-1 rounded-full w-fit">
            <span className="font-raleway font-medium text-[12px] lg:text-[14px] text-white capitalize">
              {status?.toLowerCase()}
            </span>
          </div>
        );
    }
  };

  // Map banks to the Select component's format
  const bankOptions = banks.map((bank: any) => ({
    label: `${bank.bankName} ****${bank.accountNumber?.slice(-4) || ''}`,
    value: bank.id,
  }));

  // Auto-select the first bank if available and none selected
  useEffect(() => {
    if (banks.length > 0 && !selectedBank) {
      setSelectedBank(banks[0].id);
    }
  }, [banks, selectedBank]);

  // Handle Form Submission
  const handleWithdrawal = () => {
    if (!amount || !selectedBank || Number(amount) <= 0) return;
    
    withdrawMutation.mutate(
      {
        amount: Number(amount),
        bankAccountId: selectedBank,
      },
      {
        onSuccess: () => {
          setAmount(""); // Clear input on success
        },
      }
    );
  };

  return (
    <div className="flex flex-col items-center w-full px-5 lg:px-0 pb-10">
      {/* WITHDRAW FUNDS FORM CARD */}
      <div className="flex flex-col items-center w-full bg-black/10 backdrop-blur-xl border border-white/30 rounded-[30px] lg:rounded-[50px] p-8 shadow-xl shadow-primary-blue/5 mb-15 transition-transform hover:-translate-y-1 duration-300">
        {/* Icon Header */}
        <div className="w-16 h-16 bg-primary-green/10 border border-primary-green/20 rounded-full flex items-center justify-center mb-6">
          <FiArrowDownCircle className="text-primary-green" size={32} strokeWidth={1.5} />
        </div>

        {/* Title & Description */}
        <div className="flex flex-col items-center text-center w-full mb-6">
          <h2 className="font-raleway font-semibold text-[20px] leading-7 text-white mb-2">
            Withdraw Funds
          </h2>
          <p className="font-raleway font-normal text-[16px] lg:text-[18px] leading-6 text-white/60 px-2.5">
            Transfer available balance to your linked bank account
          </p>
        </div>

        {/* Input Form */}
        <div className="flex flex-col w-full gap-4">
          {/* Amount Field */}
          <div className="flex flex-col w-full">
            <label className="font-raleway font-medium text-[14px] leading-5 text-white mb-2">
              Amount
            </label>
            <div className="relative w-full">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-raleway text-[16px] text-primary-green"></span>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-12.5 bg-white/10 border border-white/30 rounded-2xl pl-8 pr-4 font-raleway text-[16px] text-white placeholder:text-white/40 outline-none focus:border-primary-green transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <span className="font-raleway font-normal text-[12px] leading-4 text-white/60 mt-2">
              Available: {formatCurrency(AVAILABLE_BALANCE)}
            </span>
          </div>

          {/* Bank Account Dropdown */}
          <div className="flex flex-col w-full">
            <Select
              label="Bank Account"
              value={selectedBank}
              onChange={(val) => setSelectedBank(val)}
              options={bankOptions}
              placeholder="Select a saved account"
              variant="glass"
            />
          </div>

          {/* Submit Button */}
          <button 
            onClick={handleWithdrawal}
            disabled={withdrawMutation.isPending || banks.length === 0}
            className="w-full h-12 bg-primary-green hover:bg-accent-green-bright transition-colors rounded-full flex items-center justify-center mt-2 shadow-[0_4px_14px_rgba(115,191,68,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="font-raleway font-semibold text-[16px] leading-6 text-white">
              {withdrawMutation.isPending ? "Processing..." : "Withdraw Funds"}
            </span>
          </button>

          {/* Footer Note */}
          <p className="font-raleway font-normal text-[12px] leading-4 text-white/60 text-center mt-1">
            Processing time: 1-3 business days
          </p>
        </div>
      </div>

      {/* RECENT WITHDRAWALS LIST */}
      <div className="flex flex-col w-full max-w-293.5">
        <h3 className="font-raleway font-semibold text-[18px] leading-7 text-white mb-4">
          Recent Withdrawals
        </h3>

        <div className="flex flex-col gap-[12px] w-full">
          {recentWithdrawals.length === 0 ? (
            <div className="p-6 bg-black/10 backdrop-blur-xl border border-white/30 rounded-3xl text-center text-white/60">
              No recent withdrawals found.
            </div>
          ) : (
            recentWithdrawals.map((withdrawal: any) => {
              const formattedDate = new Date(withdrawal.createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit" });
              
              return (
                <div
                  key={withdrawal.id}
                  className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 lg:p-6 bg-black/10 backdrop-blur-xl border border-white/30 rounded-3xl shadow-sm hover:bg-accent-green-bright/20 transition-colors gap-4 md:gap-0 max-sm:gap-0"
                >
                  {/* Left Side: Icon & Details */}
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary-green/10 border border-primary-green/20 rounded-full flex items-center justify-center shrink-0">
                      <FiDownload className="text-primary-green" size={18} />
                    </div>

                    <div className="flex flex-col">
                      <span className="font-raleway font-medium text-[16px] leading-6 text-white">
                        Ref: {withdrawal.txRef}
                      </span>
                      <span className="font-raleway font-normal text-[13px] lg:text-[14px] leading-5 text-white/60 capitalize">
                        {formattedDate} • {withdrawal.type?.toLowerCase()}
                      </span>
                    </div>
                  </div>

                  {/* Right Side: Status & Amount */}
                  <div className="flex items-center gap-4 lg:gap-5 justify-end md:justify-end sm:flex-col max-sm:gap-0.5">
                    <div className="flex items-center gap-5">
                      {renderStatusBadge(withdrawal.status)}

                      <span className="font-raleway font-semibold text-[18px] max-sm:mt-30 max-sm:-ml-13 leading-7 text-[#D4183D] text-right ">
                        {formatCurrency(withdrawal.amount)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}