"use client";
import { useState } from "react";
import { 
  FiLock, 
  FiBriefcase, 
  FiShield, 
  FiAlertCircle
} from "react-icons/fi";
import { IoWalletOutline } from "react-icons/io5";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import InfoTooltip from "@/components/ui/InfoTooltip";

interface FundEscrowSetupProps {
  onFundEscrow?: () => void;
  walletBalance?: number;
  projectBudget?: number;
  escrowBalance?: number;
  transferAmount?: number;
  currencySymbol?: string;
}

export default function FundEscrowSetup({ 
  onFundEscrow,
  walletBalance = 5925000,
  projectBudget = 5075000,
  escrowBalance = 0,
  transferAmount = 5075000,
  currencySymbol = "₦"
}: FundEscrowSetupProps) {
  
  const [isConfirming, setIsConfirming] = useState(false);
  
  const formatCurrency = (amount: number) => `${currencySymbol}${amount.toLocaleString()}`;
  const remainingWalletBalance = walletBalance - transferAmount;
  const newEscrowBalance = escrowBalance + transferAmount;

  // Reusable blocks for mobile injection
  const TransferSummaryBox = () => (
    <div className="bg-black/70 border border-primary-green/15 rounded-[24px] flex flex-col overflow-hidden w-full">
      <div className="py-[12px] px-[18px] border-b border-white/5">
        <span className="font-raleway font-bold text-[8px] text-white/70 uppercase tracking-[0.7px]">Transfer Summary</span>
      </div>
      
      <div className="flex flex-col px-[18px] pb-[10px]">
        <div className="flex justify-between items-center py-[12px] border-b border-white/5">
          <span className="font-raleway font-normal text-[11px] text-white/60">From Wallet</span>
          <span className="font-raleway font-bold text-[12px] text-white">{formatCurrency(walletBalance)}</span>
        </div>
        <div className="flex justify-between items-center py-[12px] border-b border-white/5">
          <span className="font-raleway font-normal text-[11px] text-white/60">Transfer to Escrow</span>
          <span className="font-raleway font-bold text-[12px] text-primary-blue">-{formatCurrency(transferAmount)}</span>
        </div>
        <div className="flex justify-between items-center py-[12px] border-b border-white/5">
          <span className="font-raleway font-normal text-[11px] text-white/60">Remaining Balance</span>
          <span className="font-raleway font-bold text-[12px] text-white">{formatCurrency(remainingWalletBalance)}</span>
        </div>
        <div className="flex justify-between items-center py-[12px]">
          <span className="font-raleway font-normal text-[11px] text-white/60">New Escrow Balance</span>
          <span className="font-raleway font-bold text-[12px] text-primary-green">{formatCurrency(newEscrowBalance)}</span>
        </div>
      </div>
    </div>
  );

  const ConfirmationAlertBox = () => (
    <div className="bg-black/30 border border-white/5 rounded-[24px] p-[20px] md:p-[24px] flex items-start gap-[12px] animate-fade-in w-full">
      <FiAlertCircle className="text-white/50 shrink-0 mt-[2px]" size={18} />
      <p className="font-raleway font-normal text-[13px] md:text-[15px] leading-[18px] md:leading-[20px] text-white/70">
        Confirm transfer of {formatCurrency(transferAmount)} into escrow. Escrowed funds cannot be withdrawn until milestones are settled.
      </p>
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-[24px] md:gap-[32px]">
        
      {/* Section Header */}
      <div className="flex flex-col gap-[8px]">
        <h2 className="font-raleway font-semibold text-[20px] md:text-[24px] text-white tracking-[-0.6px]">
          Fund Payment Escrow
        </h2>
        <p className="font-raleway font-normal text-[13px] md:text-[14px] text-white/40">
          Break project compensation into measurable product milestones
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[16px] md:gap-[20px] w-full">
        
        <div className="bg-black/30 border border-white/5 rounded-[24px] p-5 md:p-[24px] flex flex-col justify-between min-h-[120px] md:min-h-[148px]">
          <div className="flex items-center gap-[12px]">
            <IoWalletOutline className="text-white/60" size={18} />
            <span className="font-raleway font-bold text-[12px] md:text-[13px] text-white">CollabDen Wallet</span>
          </div>
          <div className="flex flex-col mt-[14px]">
            <h3 className="font-raleway font-black text-[22px] md:text-[27px] text-white">{formatCurrency(walletBalance)}</h3>
          </div>
        </div>

        <div className="bg-black/30 border border-white/5 rounded-[24px] p-5 md:p-[24px] flex flex-col justify-between min-h-[120px] md:min-h-[148px]">
          <div className="flex items-center gap-[12px]">
            <FiBriefcase className="text-white/60" size={18} />
            <span className="font-raleway font-bold text-[12px] md:text-[13px] text-white">Project Budget</span>
          </div>
          <div className="flex flex-col mt-[14px]">
            <h3 className="font-raleway font-black text-[22px] md:text-[27px] text-white">{formatCurrency(projectBudget)}</h3>
            <span className="font-raleway font-normal text-[11px] md:text-[12px] text-white/50 mt-[4px]">Amount still needed</span>
          </div>
        </div>

        <div className="bg-black/30 border border-white/5 rounded-[24px] p-5 md:p-[24px] flex flex-col justify-between min-h-[120px] md:min-h-[148px]">
          <div className="flex items-center gap-[12px]">
            <FiLock className="text-white/60" size={18} />
            <span className="font-raleway font-bold text-[12px] md:text-[13px] text-white">Project Escrow</span>
          </div>
          <div className="flex flex-col mt-[14px]">
            <h3 className="font-raleway font-black text-[22px] md:text-[27px] text-white">{formatCurrency(escrowBalance)}</h3>
            <div className="flex items-center gap-[6px] mt-[4px]">
              <span className="font-raleway font-normal text-[11px] md:text-[12px] text-white/50">
                {escrowBalance === 0 ? "Not yet funded" : "Partially funded"}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Main Action Area (Standard column order, but content moves based on screen size) */}
      <div className="flex flex-col lg:flex-row gap-[24px] lg:gap-[40px] items-start w-full mt-2">
        
        {/* Transfer Form Box */}
        <div className="flex-1 bg-black/30 border border-white/5 rounded-[30px] p-6 md:p-[28px] flex flex-col w-full">
          <span className="font-raleway font-bold text-[10px] text-white/60 uppercase tracking-[1px] mb-[20px] md:mb-[24px]">Amount to Transfer</span>
          
          {/* MOBILE ONLY: Injected Summary Box (Hidden on Desktop) */}
          <div className="flex lg:hidden w-full mb-[24px]">
            <TransferSummaryBox />
          </div>

          <div className="flex flex-col gap-[8px] mb-[24px]">
            <div className="flex items-center gap-[6px]">
              <span className="font-raleway font-bold text-[11px] text-white/60 uppercase tracking-[0.5px]">Funding Amount</span>
              <InfoTooltip text="Funding amount includes the project base and a 1.5% escrow processing fee." />
            </div>
            
            <Input 
              variant="glass" 
              defaultValue={transferAmount.toLocaleString()}
              readOnly={isConfirming}
              className={`pl-[36px] font-bold text-[16px] ${isConfirming ? 'opacity-70' : ''}`}
            >
               <span className="absolute left-[16px] top-1/2 -translate-y-1/2 font-raleway font-semibold text-[16px] text-white/50">
                 {currencySymbol}
               </span>
            </Input>
            <span className="font-raleway font-normal text-[12px] md:text-[13px] text-white/50">
              Recommended: {formatCurrency(transferAmount)} (escrow + 1.5% fee)
            </span>
          </div>

          {/* MOBILE ONLY: Injected Confirmation Alert (Hidden on Desktop) */}
          {isConfirming && (
            <div className="flex lg:hidden w-full mb-[24px]">
              <ConfirmationAlertBox />
            </div>
          )}

          {/* Dynamic Action Button */}
          {isConfirming ? (
            <Button 
              variant="primary"
              onClick={onFundEscrow}
              className="w-full rounded-[18px] py-[16px] md:py-[18px] shadow-btn-primary scale-[1.02] transition-transform mt-auto"
            >
              <span className="font-raleway font-black text-[14px] md:text-[15px] text-white">Confirm & Fund Escrow</span>
            </Button>
          ) : (
            <Button 
              variant="primary"
              onClick={() => setIsConfirming(true)}
              className="w-full rounded-[18px] py-[16px] md:py-[18px] shadow-btn-primary mt-auto"
            >
              <span className="font-raleway font-black text-[14px] md:text-[15px] text-white">Fund Escrow — {formatCurrency(transferAmount)}</span>
            </Button>
          )}
        </div>

        {/* Desktop Sidebar (Context Elements) */}
        <div className="w-full lg:w-[346px] flex flex-col gap-[16px] shrink-0">
          
          {/* DESKTOP ONLY: Summary Box */}
          <div className="hidden lg:flex w-full">
            <TransferSummaryBox />
          </div>

          {/* DESKTOP ONLY: Confirmation Alert */}
          {isConfirming && (
            <div className="hidden lg:flex w-full">
               <ConfirmationAlertBox />
            </div>
          )}

          {/* Security Banner (Always at the bottom of the sidebar/page) */}
          <div className="bg-black/30 border border-white/5 rounded-[24px] p-[20px] md:p-[24px] flex flex-col gap-[12px]">
            <div className="flex items-center gap-[8px]">
              <FiShield className="text-primary-green" size={18} />
              <span className="font-raleway font-semibold text-[14px] md:text-[15px] text-primary-green">Protected by CollabDen Escrow</span>
            </div>
            <p className="font-raleway font-normal text-[13px] md:text-[15px] leading-[18px] md:leading-[20px] text-white/70">
              Funds are held in a segregated Flutterwave escrow account and released only per agreed milestones.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}