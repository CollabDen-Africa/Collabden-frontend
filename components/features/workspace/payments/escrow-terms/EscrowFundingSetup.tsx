"use client";
import { useState } from "react";
import { 
  FiCheck, 
  FiArrowLeft, 
  FiShield,
  FiCalendar
} from "react-icons/fi";
import { IoWalletOutline } from "react-icons/io5";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Select from "@/components/ui/Select";


interface FundingCollaborator {
  id: number;
  name: string;
  isApproved: boolean;
}

interface EscrowFundingSetupProps {
  onBack?: () => void;
  onActivateEscrow?: () => void;
  // Dynamic props
  totalFunding?: number;
  escrowAmount?: number;
  feeAmount?: number;
  fundingDeadline?: string;
  daysRemaining?: number;
  currencySymbol?: string;
  collaborators?: FundingCollaborator[];
}

const DEFAULT_COLLABORATORS: FundingCollaborator[] = [
  { id: 1, name: "Oyinda Adeyemi", isApproved: true },
  { id: 2, name: "Tunde Martins", isApproved: true },
  { id: 3, name: "Amara Okonkwo", isApproved: true },
  { id: 4, name: "Kemi Babalola", isApproved: true },
  { id: 5, name: "Seun Ibrahim", isApproved: false },
  { id: 6, name: "Dayo Rasheed", isApproved: false }
];

export default function EscrowFundingSetup({ 
  onBack, 
  onActivateEscrow,
  totalFunding = 5075000,
  escrowAmount = 5000000,
  feeAmount = 75000,
  fundingDeadline = "July 1, 2026",
  daysRemaining = 7,
  currencySymbol = "₦",
  collaborators = DEFAULT_COLLABORATORS
}: EscrowFundingSetupProps) {

  
  const [paymentOption, setPaymentOption] = useState("wallet");
  const formatCurrency = (amount: number) => `${currencySymbol}${amount.toLocaleString()}`;

  const PAYMENT_OPTIONS = [
     { label: `CollabDen Wallet (Bal: ${formatCurrency(850000)})`, value: "wallet" },
     { label: "Debit Card ending in 8832", value: "card" },
     { label: "Bank Transfer", value: "bank" }
   ];

  

  return (
    <div>
        {/* Section Header */}
        <div className="flex flex-col gap-2 mb-8">
          <h2 className="font-raleway font-extrabold text-[24px] text-white tracking-[-0.6px]">
            Collaborator Approvals
          </h2>
          <p className="font-raleway font-normal text-[14px] text-text-muted/90">
            All collaborators must approve the terms before escrow activation.
          </p>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col-reverse lg:flex-row gap-6 w-full">
          
          {/* Left Column - Funding Setup */}
          <div className="flex-1 bg-black/15 border border-white/5 rounded-3xl p-5 flex flex-col relative backdrop-blur-md">
            <span className="font-raleway font-bold text-[11px] text-text-muted tracking-[1px] uppercase mb-6">
              Fund Escrow
            </span>

            {/* Total Block */}
            <div className="w-full bg-black/15 rounded-[20px] p-5 flex flex-col sm:flex-row sm:justify-between items-center gap-5 sm:gap-0 mb-8 border border-white/5">
              <div className="flex flex-col">
                <span className="font-raleway font-normal text-[11px] text-text-muted tracking-[1px] uppercase mb-3">
                  Total Funding Required
                </span>
                <span className="font-raleway font-black text-[40px] text-white leading-none mb-3">
                  {formatCurrency(totalFunding)}
                </span>
                <span className="font-raleway font-normal text-[14px] text-text-muted">
                  {formatCurrency(escrowAmount)} escrow + {formatCurrency(feeAmount)} fee (1.5%)
                </span>
              </div>
              <div className="w-16 h-16 rounded-[20px] bg-primary-green/10 border border-primary-green/20 hidden sm:flex items-center justify-center">
                <IoWalletOutline size={28} className="text-primary-green" />
              </div>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-5 mb-8">
              
              {/* Payment Method */}
              <div className="flex flex-col gap-3 mb-1">
                <label className="font-raleway font-semibold text-[13px] text-text-muted tracking-[0.5px] uppercase">
                  Payment Method
                </label>
                <Select 
                                 options={PAYMENT_OPTIONS}
                                 value={paymentOption}
                                 onChange={setPaymentOption}
                                 variant="glass"
                               />

              </div>

              {/* Funding Deadline */}
              <div className="flex flex-col gap-3 mt-3">
                <label className="font-raleway font-semibold text-[13px] text-text-muted tracking-[0.5px] uppercase">
                  Funding Deadline
                </label>
                <button className="w-full bg-black/15 border border-white/10 hover:border-white/20 transition-colors rounded-2xl p-4 flex items-center justify-between opacity-60">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <FiCalendar className="text-white/60" size={16} />
                    </div>
                    <span className="font-raleway font-semibold text-[15px] text-white">{fundingDeadline}</span>
                  </div>
                </button>
              </div>

            </div>

            {/* In-Panel CTA */}
            <Button 
              variant="primary"
              onClick={onActivateEscrow}
              className="mt-auto w-full rounded-[20px] py-1.5 shadow-[0_4px_28px_rgba(115,191,68,0.25)] flex items-center justify-center gap-3 transition-all transform hover:scale-[1.01] active:scale-[0.99]"
              icon={FiShield}
              iconPosition="left"
            >
              <span className="font-raleway font-black text-sm sm:text-[18px]">
                Fund Escrow Now — {formatCurrency(totalFunding)}
              </span>
            </Button>
          </div>

          {/* Right Column - Status & Info Sidebar */}
          <div className="w-85 shrink-0 flex flex-col gap-5">
            
            {/* Approvals Summary Card */}
            <div className="bg-black/15 border border-white/5 rounded-3xl p-6 flex flex-col backdrop-blur-md">
              <span className="font-raleway font-bold text-[11px] text-text-muted tracking-[1px] uppercase mb-5">
                Approval Status
              </span>
              <div className="flex flex-col gap-4">
                {collaborators.map((collab) => (
                  <div key={collab.id} className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <Avatar name={collab.name} className="w-7.5 h-7.5 text-[10px]" />
                      <span className="font-raleway font-normal text-[14px] text-white/80">
                        {collab.name}
                      </span>
                    </div>
                    <div className={`px-3 py-1.5 rounded-full border flex items-center justify-center
                      ${collab.isApproved ? 'bg-primary-green/10 border-primary-green/20' : 'bg-secondary-blue/10 border-white/10'}`}>
                      <span className={`font-raleway font-bold text-[11px] uppercase tracking-[0.5px]
                        ${collab.isApproved ? 'text-primary-green' : 'text-text-muted'}`}>
                        {collab.isApproved ? "Approved" : "Pending"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Info Card - Protection */}
            <div className="bg-primary-blue/10 border border-primary-blue/20 rounded-3xl p-6 flex flex-col backdrop-blur-md">
              <div className="flex gap-2">
              <FiShield size={24} className="text-secondary-blue mb-4" />
              <h4 className="font-raleway font-bold text-[15px] text-secondary-blue mb-2">
                Escrow Protection
                </h4>
              </div>
              <p className="font-raleway font-normal text-[14px] text-accent-soft-blue/75 leading-[1.6]">
                Funds are protected until each milestone's release conditions are met and approved by all required collaborators.
              </p>
            </div>

            {/* Info Card - Deadline */}
            <div className="bg-black/15 border border-white/5 rounded-3xl p-6 flex flex-col backdrop-blur-md items-center justify-center">
              <span className="font-raleway font-bold text-[11px] text-text-muted tracking-[1px] uppercase mb-4">
                Funding Deadline
              </span>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-2 h-2 rounded-full bg-accent-yellow opacity-80" />
                <span className="font-raleway font-semibold text-[16px] text-white">
                  {fundingDeadline}
                </span>
              </div>
              <p className="font-raleway font-normal text-[14px] text-text-muted">
                {daysRemaining} days remaining to fund
              </p>
            </div>

          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-12 pt-6 border-t border-white/5">
          
          <Button 
            variant="ghost"
            onClick={onBack}
            className="opacity-50 hover:opacity-100 hover:bg-white/10"
            icon={FiArrowLeft}
            iconPosition="left"
          >
            Back
          </Button>

          {/* Setup Progress Indicators - Step 6 active */}
          <div className="hidden sm:flex items-center gap-[6px]">
            <div className="w-4.5 h-1.75 bg-primary-green/50 rounded-full" />
            <div className="w-4.5 h-1.75 bg-primary-green/50 rounded-full" />
            <div className="w-4.5 h-1.75 bg-primary-green/50 rounded-full" />
            <div className="w-4.5 h-1.75 bg-primary-green/50 rounded-full" />
            <div className="w-4.5 h-1.75 bg-primary-green/50 rounded-full" />
            <div className="w-7 h-1.75 bg-primary-green rounded-full" />
          </div>

          <Button 
            variant="primary"
            onClick={onActivateEscrow}
            className="rounded-[20px] shadow-[0_2px_18px_rgba(115,191,68,0.2)]"
            icon={FiCheck}
            iconPosition="right"
          >
            <span className="font-raleway font-bold text-[16px] text-white">Activate Escrow</span>
          </Button>

        </div>

      </div>
  );
}