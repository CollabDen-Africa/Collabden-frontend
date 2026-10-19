"use client";

import { 
  FiLock, 
  FiBriefcase, 
  FiShield 
} from "react-icons/fi";
import { IoWalletOutline } from "react-icons/io5";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import InfoTooltip from "@/components/ui/InfoTooltip";
import { useWorkspace } from "@/context/WorkspaceContext";
import { usePayment } from "@/hooks/payment/usePayment";
import { useEscrow } from "@/hooks/escrow/useEscrow";

interface FundEscrowSetupProps {
  onContinueToTerms?: () => void;
}

export default function FundEscrowSetup({ 
  onContinueToTerms 
}: FundEscrowSetupProps) {
  const { activeProject } = useWorkspace();
  const projectId = activeProject?.id || "";

  const { useWallet } = usePayment();
  const { data: walletData } = useWallet();

  const { useProjectEscrow } = useEscrow();
  const { data: escrowData } = useProjectEscrow(projectId);

  const walletBalance = walletData?.balance || 0;
  const currencySymbol = walletData?.currency === "USD" ? "$" : "₦";

  const projectBudget = activeProject?.budget ? Number(activeProject.budget) : (escrowData?.totalAmount || 0);
  const escrowBalance = escrowData?.fundedAmount || 0;

  // The transfer amount is strictly the deficit remaining to fully fund the escrow
  const transferAmount = projectBudget > escrowBalance ? projectBudget - escrowBalance : 0;
  
  const remainingWalletBalance = walletBalance - transferAmount;
  const newEscrowBalance = escrowBalance + transferAmount;

  const formatCurrency = (amount: number) => `${currencySymbol}${amount.toLocaleString()}`;

  // Reusable blocks for mobile injection
  const TransferSummaryBox = () => (
    <div className="bg-black/70 border border-primary-green/15 rounded-3xl flex flex-col overflow-hidden w-full">
      <div className="py-3 px-4.5 border-b border-white/5">
        <span className="font-raleway font-bold text-[8px] text-white/70 uppercase tracking-[0.7px]">Transfer Summary</span>
      </div>
      
      <div className="flex flex-col px-4.5 pb-2.5">
        <div className="flex justify-between items-center py-3 border-b border-white/5">
          <span className="font-raleway font-normal text-[11px] text-white/60">From Wallet</span>
          <span className="font-raleway font-bold text-[12px] text-white">{formatCurrency(walletBalance)}</span>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-white/5">
          <span className="font-raleway font-normal text-[11px] text-white/60">Required Escrow Funding</span>
          <span className="font-raleway font-bold text-[12px] text-primary-blue">-{formatCurrency(transferAmount)}</span>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-white/5">
          <span className="font-raleway font-normal text-[11px] text-white/60">Projected Wallet Balance</span>
          <span className="font-raleway font-bold text-[12px] text-white">{formatCurrency(remainingWalletBalance)}</span>
        </div>
        <div className="flex justify-between items-center py-3">
          <span className="font-raleway font-normal text-[11px] text-white/60">Projected Escrow Balance</span>
          <span className="font-raleway font-bold text-[12px] text-primary-green">{formatCurrency(newEscrowBalance)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-6 md:gap-8">
      
      {/* Section Header */}
      <div className="flex flex-col gap-2">
        <h2 className="font-raleway font-semibold text-[20px] md:text-[24px] text-white tracking-[-0.6px]">
          Escrow Funding Overview
        </h2>
        <p className="font-raleway font-normal text-[13px] md:text-[14px] text-white/40">
          Review your wallet balances before configuring the project milestones.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 w-full">
        <div className="bg-black/30 border border-white/5 rounded-3xl p-5 md:p-6 flex flex-col justify-between min-h-30 md:min-h-37">
          <div className="flex items-center gap-3">
            <IoWalletOutline className="text-white/60" size={18} />
            <span className="font-raleway font-bold text-[12px] md:text-[13px] text-white">CollabDen Wallet</span>
          </div>
          <div className="flex flex-col mt-3.5">
            <h3 className="font-raleway font-black text-[22px] md:text-[27px] text-white">{formatCurrency(walletBalance)}</h3>
          </div>
        </div>

        <div className="bg-black/30 border border-white/5 rounded-3xl p-5 md:p-6 flex flex-col justify-between min-h-30 md:min-h-37">
          <div className="flex items-center gap-3">
            <FiBriefcase className="text-white/60" size={18} />
            <span className="font-raleway font-bold text-[12px] md:text-[13px] text-white">Project Budget</span>
          </div>
          <div className="flex flex-col mt-3.5">
            <h3 className="font-raleway font-black text-[22px] md:text-[27px] text-white">{formatCurrency(projectBudget)}</h3>
            <span className="font-raleway font-normal text-[11px] md:text-[12px] text-white/50 mt-1">Amount still needed</span>
          </div>
        </div>

        <div className="bg-black/30 border border-white/5 rounded-3xl p-5 md:p-6 flex flex-col justify-between min-h-30 md:min-h-37">
          <div className="flex items-center gap-3">
            <FiLock className="text-white/60" size={18} />
            <span className="font-raleway font-bold text-[12px] md:text-[13px] text-white">Project Escrow</span>
          </div>
          <div className="flex flex-col mt-3.5">
            <h3 className="font-raleway font-black text-[22px] md:text-[27px] text-white">{formatCurrency(escrowBalance)}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="font-raleway font-normal text-[11px] md:text-[12px] text-white/50">
                {escrowBalance === 0 ? "Not yet funded" : "Partially funded"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Action Area */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start w-full mt-2">
        
        {/* Transfer Form Box (Read-Only) */}
        <div className="flex-1 bg-black/30 border border-white/5 rounded-[30px] p-6 md:p-7 flex flex-col w-full">
          <span className="font-raleway font-bold text-[10px] text-white/60 uppercase tracking-[1px] mb-5 md:mb-6">Required Funding</span>
          
          <div className="flex lg:hidden w-full mb-6">
            <TransferSummaryBox />
          </div>

          <div className="flex flex-col gap-2 mb-6">
            <div className="flex items-center gap-1.5">
              <span className="font-raleway font-bold text-[11px] text-white/60 uppercase tracking-[0.5px]">Amount Required</span>
              <InfoTooltip text="Funding amount includes the project base and a 1.5% escrow processing fee." />
            </div>
            
            <Input 
              variant="glass" 
              defaultValue={transferAmount.toLocaleString()}
              readOnly={true}
              className="pl-9 font-bold text-[16px] opacity-70"
            >
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-raleway font-semibold text-[16px] text-white/50">
                {currencySymbol}
              </span>
            </Input>
            <span className="font-raleway font-normal text-[12px] md:text-[13px] text-white/50">
              Includes: {formatCurrency(transferAmount)} (escrow + 1.5% fee)
            </span>
          </div>

          {/* Dynamic Action Button */}
          <Button 
            variant="primary"
            onClick={onContinueToTerms}
            className="w-full rounded-[18px] py-4 md:py-4.5 shadow-btn-primary mt-auto"
          >
            <span className="font-raleway font-black text-[14px] md:text-[15px] text-white">
              Continue to Escrow Setup
            </span>
          </Button>
        </div>

        {/* Desktop Sidebar (Context Elements) */}
        <div className="w-full lg:w-86.5 flex flex-col gap-4 shrink-0">
          <div className="hidden lg:flex w-full">
            <TransferSummaryBox />
          </div>

          {/* Security Banner */}
          <div className="bg-black/30 border border-white/5 rounded-3xl p-5 md:p-6 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <FiShield className="text-primary-green" size={18} />
              <span className="font-raleway font-semibold text-[14px] md:text-[15px] text-primary-green">Protected by CollabDen Escrow</span>
            </div>
            <p className="font-raleway font-normal text-[13px] md:text-[15px] leading-4.5 md:leading-5 text-white/70">
              Funds are held in a segregated Flutterwave escrow account and released only per agreed milestones.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}