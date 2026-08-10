"use client";
import { 
  FiCreditCard, 
  FiLock, 
  FiAlertTriangle, 
  FiArrowRight, 
  FiFileText 
} from "react-icons/fi";
import Button from "@/components/ui/Button";

interface PaymentSetupProps {
  onBeginSetup?: () => void;
  // Dynamic data props
  walletBalance?: number;
  escrowBalance?: number;
  requiredAmount?: number;
  currencySymbol?: string;
  projectName?: string;
  agreementDate?: string;
  collaboratorsCount?: number;
}

export default function PaymentSetup({ 
  onBeginSetup,
  walletBalance = 850000,
  escrowBalance = 0,
  requiredAmount = 5075000,
  currencySymbol = "₦",
  projectName = "Urban Beats Vol. 2",
  agreementDate = "June 24, 2026",
  collaboratorsCount = 6
}: PaymentSetupProps) {
  
  // Helper to format currency dynamically
  const formatCurrency = (amount: number) => `${currencySymbol}${amount.toLocaleString()}`;
  
  const isWalletSufficient = walletBalance >= requiredAmount;

  return (
    <div>
        {/* Top Cards Row: Wallet & Escrow Status */}
        <div className="flex flex-col md:flex-row gap-6 w-full mb-6">
          
          {/* CollabDen Wallet Card */}
          <div className="flex-1 bg-black/20 border border-white/5 rounded-4xl p-6 flex flex-col justify-between h-48.75 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <FiCreditCard className="text-text-muted" size={20} />
              <span className="font-raleway font-bold text-[14px] text-white">CollabDen Wallet</span>
            </div>
            
            <div className="flex flex-col gap-1 mt-3.5">
              <h2 className="font-raleway font-black text-[28px] text-white">
                {formatCurrency(walletBalance)}
              </h2>
              <span className="font-raleway font-normal text-[14px] text-text-muted">Current balance · Needs top-up</span>
            </div>

            <div className="flex items-center gap-2 mt-auto pt-4">
              <FiAlertTriangle className={isWalletSufficient ? "text-primary-green" : "text-accent-yellow"} size={16} />
              <span className={`font-raleway font-normal text-[14px] ${isWalletSufficient ? "text-primary-green" : "text-accent-yellow"}`}>
                {isWalletSufficient ? "Sufficient funds" : "Insufficient to fund escrow"}
              </span>
            </div>
          </div>

          {/* Project Escrow Card */}
          <div className="flex-1 bg-black/20 border border-white/5 rounded-[34px] p-[24px] flex flex-col justify-between h-[195px] backdrop-blur-md">
            <div className="flex items-center gap-[12px]">
              <FiLock className="text-text-muted" size={20} />
              <span className="font-raleway font-bold text-[14px] text-white">Project Escrow</span>
            </div>
            
            <div className="flex flex-col gap-1 mt-3.5">
              <h2 className="font-raleway font-black text-[28px] text-white">
                {formatCurrency(escrowBalance)}
              </h2>
              <span className="font-raleway font-normal text-[14px] text-text-muted">
                {escrowBalance > 0 ? "Partially funded" : "Not yet funded"}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-auto pt-4">
              <div className="w-1.5 h-1.5 rounded-full bg-primary-blue" />
              <span className="font-raleway font-normal text-[14px] text-text-muted">
                Requires {formatCurrency(requiredAmount)} to activate
              </span>
            </div>
          </div>

        </div>

        {/* Legal Agreement Prerequisite Card */}
        <div className="w-full bg-black/20 border border-white/5 rounded-4xl p-7 flex flex-col gap-6 backdrop-blur-md mb-10">
          
          <div className="flex flex-col md:flex-row justify-between items-start w-full">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary-green/10 border border-primary-green/20 flex items-center justify-center shrink-0">
                <FiFileText className="text-primary-green" size={18} />
              </div>
              <div className="flex flex-col gap-[2px]">
                <span className="font-raleway font-bold text-[12px] text-primary-green/70 uppercase tracking-[1px]">Legal Agreement</span>
                <span className="font-raleway font-normal text-[14px] text-text-muted">Escrow precondition met</span>
              </div>
            </div>

            <div className="bg-primary-green/10 border border-primary-green/20 rounded-full px-3.5 py-1.5 flex items-center gap-1.5 mt-5 md:mt-0">
              <div className="w-1.5 h-1.5 rounded-full bg-primary-green" />
              <span className="font-raleway font-bold text-xs md:text-sm text-primary-green uppercase tracking-[0.5px]">Fully Signed</span>
            </div>
          </div>

          <h3 className="font-raleway font-bold text-[19px] text-white">
            Brand Identity & Product Design Agreement
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 w-full border-t border-white/5 pt-6">
            <div className="flex flex-col gap-1">
              <span className="font-raleway font-normal text-[11px] text-text-muted uppercase tracking-[1px] mb-2">Project</span>
              <span className="font-raleway font-normal text-[16px] text-accent-soft-blue">{projectName}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-raleway font-normal text-[11px] text-text-muted uppercase tracking-[1px] mb-2">Date Signed</span>
              <span className="font-raleway font-normal text-[16px] text-accent-soft-blue">{agreementDate}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-raleway font-normal text-[11px] text-text-muted uppercase tracking-[1px] mb-2">Collaborators</span>
              <span className="font-raleway font-normal text-[16px] text-accent-soft-blue">{collaboratorsCount} parties</span>
            </div>
          </div>

        </div>

        {/* CTA Button */}
        <div className="mt-auto pt-10 mb-2">
          <Button 
            onClick={onBeginSetup}
            variant="primary"
            className="w-full rounded-full py-4.5 flex justify-center items-center gap-3 group"
          >
            <span className="font-raleway font-black text-[16px] text-white">
              Begin Payment Setup
            </span>
            <div className="w-5 h-5 rounded-full border-[1.5px] border-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
               <FiArrowRight size={12} className="text-white" />
            </div>
          </Button>
      </div>
    </div>
  );
}