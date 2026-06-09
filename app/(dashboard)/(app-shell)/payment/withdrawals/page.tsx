"use client";

import React, { useState } from "react";
import { 
  FiArrowDownCircle, 
  FiCheckCircle, 
  FiClock, 
  FiDownload
} from "react-icons/fi";
import Select from "@/components/ui/Select";

// --- MOCK DATA ---
const AVAILABLE_BALANCE: number = 18420.50;

const BANK_ACCOUNTS: any[] = [
  { id: "ba_1", name: "Wells Fargo ****4567" },
  { id: "ba_2", name: "Chase Bank ****8901" }
];

const RECENT_WITHDRAWALS: any[] = [
  {
    id: "w_1",
    account: "Wells Fargo ****4567",
    date: "May 25",
    type: "withdrawal",
    status: "successful",
    amount: -5000,
  },
  {
    id: "w_2",
    account: "Chase Bank ****8901",
    date: "May 12",
    type: "withdrawal",
    status: "successful",
    amount: -2500,
  },
  {
    id: "w_3",
    account: "Wells Fargo ****4567",
    date: "May 01",
    type: "withdrawal",
    status: "processing",
    amount: -1200,
  }
];

export default function WithdrawalsPage() {
  const [amount, setAmount] = useState<string>("");
  const [selectedBank, setSelectedBank] = useState<string>(BANK_ACCOUNTS[0].id);

  // Format currency dynamically
  const formatCurrency = (val: number) => {
    const formatted = new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(Math.abs(val));
    return val < 0 ? `-${formatted}` : formatted;
  };

  // Status-based styling for the badges
  const renderStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "successful":
        return (
          <div className="flex items-center gap-[6px] bg-accent-green-success/10 border border-accent-green-bright/20 px-[12px] py-[4px] rounded-full w-fit">
            <FiCheckCircle className="text-accent-green-success" size={14} />
            <span className="font-raleway font-medium text-[12px] lg:text-[14px] text-accent-green-success capitalize">
              {status}
            </span>
          </div>
        );
      case "processing":
        return (
          <div className="flex items-center gap-[6px] bg-primary-blue/30 border border-primary-blue/20 px-[12px] py-[4px] rounded-full w-fit">
            <FiClock className="text-secondary-blue" size={14} />
            <span className="font-raleway font-medium text-[12px] lg:text-[14px] text-secondary-blue capitalize">
              {status}
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  // Mock bank data to the Select component's format
    const bankOptions = BANK_ACCOUNTS.map((bank) => ({
      label: bank.name,
      value: bank.id,
    }));

  return (
    <div className="flex flex-col items-center w-full px-[20px] lg:px-0 pb-[40px]">
      
      
      {/* WITHDRAW FUNDS FORM CARD                   */}
      
      <div className="flex flex-col items-center w-full bg-black/10 backdrop-blur-xl border border-white/30 rounded-[30px] lg:rounded-[50px] p-[32px] shadow-xl shadow-primary-blue/5 mb-[60px] transition-transform hover:-translate-y-1 duration-300">
        
        {/* Icon Header */}
        <div className="w-[64px] h-[64px] bg-primary-green/10 border border-primary-green/20 rounded-full flex items-center justify-center mb-[24px]">
          <FiArrowDownCircle className="text-primary-green" size={32} strokeWidth={1.5} />
        </div>

        {/* Title & Description */}
        <div className="flex flex-col items-center text-center w-full mb-[24px]">
          <h2 className="font-raleway font-semibold text-[20px] leading-[28px] text-white mb-[8px]">
            Withdraw Funds
          </h2>
          <p className="font-raleway font-normal text-[16px] lg:text-[18px] leading-[24px] text-white/60 px-[10px]">
            Transfer available balance to your linked bank account
          </p>
        </div>

        {/* Input Form */}
        <div className="flex flex-col w-full gap-[16px]">
          
          {/* Amount Field */}
          <div className="flex flex-col w-full">
            <label className="font-raleway font-medium text-[14px] leading-[20px] text-white mb-[8px]">
              Amount
            </label>
            <div className="relative w-full">
              <span className="absolute left-[16px] top-1/2 -translate-y-1/2 font-raleway text-[16px] text-primary-green">
                ₦
              </span>
              <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
                className="w-full h-[50px] bg-white/10 border border-white/30 rounded-[16px] pl-[32px] pr-[16px] font-raleway text-[16px] text-white placeholder:text-white/40 outline-none focus:border-primary-green transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <span className="font-raleway font-normal text-[12px] leading-[16px] text-white/60 mt-[8px]">
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
          <button className="w-full h-[48px] bg-primary-green hover:bg-accent-green-bright transition-colors rounded-full flex items-center justify-center mt-[8px] shadow-[0_4px_14px_rgba(115,191,68,0.3)]">
            <span className="font-raleway font-semibold text-[16px] leading-[24px] text-white">
              Withdraw Funds
            </span>
          </button>

          {/* Footer Note */}
          <p className="font-raleway font-normal text-[12px] leading-[16px] text-white/60 text-center mt-[4px]">
            Processing time: 1-3 business days
          </p>

        </div>
      </div>

      {/* RECENT WITHDRAWALS LIST                    */}
      <div className="flex flex-col w-full max-w-[1174px]">
        <h3 className="font-raleway font-semibold text-[18px] leading-[28px] text-white mb-[16px]">
          Recent Withdrawals
        </h3>
        
        <div className="flex flex-col gap-[12px] w-full">
          {RECENT_WITHDRAWALS.map((withdrawal) => (
            <div 
              key={withdrawal.id}
              className="flex flex-col md:flex-row justify-between items-start md:items-center p-[16px] lg:p-[24px] bg-black/10 backdrop-blur-xl border border-white/30 rounded-[24px] shadow-sm hover:bg-accent-green-bright/20 transition-colors gap-[16px] md:gap-0 max-sm:gap-0"
            >
              
              {/* Left Side: Icon & Details */}
              <div className="flex items-center gap-[16px]">
                <div className="w-[40px] h-[40px] bg-primary-green/10 border border-primary-green/20 rounded-full flex items-center justify-center shrink-0">
                  <FiDownload className="text-primary-green" size={18} />
                </div>
                
                <div className="flex flex-col">
                  <span className="font-raleway font-medium text-[16px] leading-[24px] text-white">
                    {withdrawal.account}
                  </span>
                  <span className="font-raleway font-normal text-[13px] lg:text-[14px] leading-[20px] text-white/60 capitalize">
                    {withdrawal.date} • {withdrawal.type}
                  </span>
                </div>
              </div>

              {/* Right Side: Status & Amount */}
              <div className="flex items-center gap-[16px] lg:gap-[20px] justify-end md:justify-end sm:flex-col max-sm:gap-[2px]">
              <div className="flex items-center gap-5">
                {renderStatusBadge(withdrawal.status)}
                
                <span className="font-raleway font-semibold text-[18px] max-sm:mt-[120px] max-sm:ml-[-52px] leading-[28px] text-[#D4183D] text-right ">
                  {formatCurrency(withdrawal.amount)}
                </span>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}