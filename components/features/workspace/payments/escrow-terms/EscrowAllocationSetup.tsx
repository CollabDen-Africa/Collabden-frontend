"use client";

import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Avatar from "@/components/ui/Avatar";
import { usePayment } from "@/hooks/payment/usePayment";


interface EscrowAllocationsSetupProps {
  allocations: {
    list: any[];
    totalAllocated: number;
    unallocated: number;
  };
  totalBudget: number;
  onBack?: () => void; 
  onContinueToReview?: () => void;
}

export default function EscrowAllocationsSetup({
  allocations,
  totalBudget,
  onBack,
  onContinueToReview,
}: EscrowAllocationsSetupProps) {

  const { useWallet } = usePayment();
  const { data: walletData } = useWallet();
  const currencySymbol = walletData?.currency === "USD" ? "$" : "₦";
  
  const formatCurrency = (amount: number) => `${currencySymbol}${amount.toLocaleString()}`;

  return (
    <div>
        {/* Section Header */}
        <div className="flex flex-col gap-2 mb-8">
          <h2 className="font-raleway font-extrabold text-[24px] text-white tracking-[-0.6px]">
            Allocate Payments
          </h2>
          <p className="font-raleway font-normal text-[14px] text-text-muted/80">
            Define how project funds will be distributed among collaborators.
          </p>
        </div>

        {/* Budget Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.75 mb-8">
          {/* Total Budget */}
          <div className="bg-black/15 border border-white/5 rounded-[30px] p-5.5 flex flex-col justify-center min-h-35 backdrop-blur-md">
            <span className="font-raleway font-normal text-[10px] text-text-muted uppercase tracking-[1px] mb-2.25">
              Total Budget
            </span>
            <h3 className="font-raleway font-bold text-[22px] text-white">
              {formatCurrency(totalBudget)}
            </h3>
          </div>

          {/* Total Allocated */}
          <div className="bg-black/15 border border-white/5 rounded-[30px] p-5.5 flex flex-col justify-center min-h-35 backdrop-blur-md">
            <span className="font-raleway font-normal text-[10px] text-text-muted uppercase tracking-[1px] mb-2.25">
              Total Allocated
            </span>
            <h3 className="font-raleway font-bold text-[22px] text-primary-green">
              {formatCurrency(allocations.totalAllocated)}
            </h3>
          </div>

          {/* Unallocated */}
          <div className="bg-black/15 border border-white/5 rounded-[30px] p-5.5 flex flex-col justify-center min-h-35 backdrop-blur-md">
            <span className="font-raleway font-normal text-[10px] text-text-muted uppercase tracking-[1px] mb-2.25">
              Unallocated
            </span>
            <h3 className="font-raleway font-bold text-[22px] text-text-muted">
              {formatCurrency(allocations.unallocated)}
            </h3>
          </div>
        </div>

        {/* Collaborators Allocation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {allocations.list.map((collab) => (
            <div key={collab.id} className="bg-black/15 border border-white/5 rounded-[30px] p-5 flex flex-col backdrop-blur-md">
              
              {/* User Info & Schedule */}
              <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <Avatar name={collab.name} className="w-10 h-10 text-[14px]" />
                  <div className="flex flex-col">
                    <h4 className="font-raleway font-bold text-[14px] text-white">
                      {collab.name}
                    </h4>
                    <span className="font-raleway font-normal text-[12px] text-text-muted/90 mt-0.5">
                      {collab.role}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-start sm:items-end text-right mt-3 sm:mt-0">
                  <span className="font-raleway font-normal text-[12px] text-text-muted/80">
                    Schedule
                  </span>
                  <span className="font-raleway font-semibold text-[12px] text-white/60 mt-0.5">
                    {collab.schedule}
                  </span>
                </div>
              </div>

              {/* Amount Input */}
              <div className="mb-3">
                <Input 
                  label={`Allocation Amount (${currencySymbol})`}
                  defaultValue={collab.amount}
                  variant="glass"
                  className="font-normal"
                />
              </div>

              {/* Share Percentage Indicator */}
              <div className="flex flex-col gap-1.5 mt-auto pt-1">
                <div className="flex justify-between items-center w-full">
                  <span className="font-raleway font-normal text-[12px] text-text-muted/80">
                    Share of total budget
                  </span>
                  <span className={`font-raleway font-bold text-[12px] ${collab.textClass}`}>
                    {collab.share}
                  </span>
                </div>
                {/* Custom Progress Bar */}
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden flex">
                  <div 
                    className={`h-full bg-linear-to-r ${collab.colorClass} rounded-full`}
                    style={{ width: collab.share }}
                  />
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-0 justify-between mt-12 pt-6 border-t border-white/5">
          
          <Button 
            variant="ghost"
            onClick={onBack}
            className="opacity-50 hover:opacity-100 hover:bg-white/10"
            icon={FiArrowLeft}
            iconPosition="left"
          >
            Back
          </Button>

          {/* Setup Progress Indicators */}
          <div className="hidden sm:flex items-center gap-1.5">
            <div className="w-1.75 h-1.75 bg-primary-green rounded-full" />
            <div className="w-6.75 h-1.75 bg-primary-green rounded-full" />
            <div className="w-1.75 h-1.75 bg-primary-green rounded-full" />
            <div className="w-1.75 h-1.75 bg-white/10 rounded-full" />
            <div className="w-1.75 h-1.75 bg-white/10 rounded-full" />
            <div className="w-1.75 h-1.75 bg-white/10 rounded-full" />
          </div>

          <Button 
            variant="primary"
            onClick={onContinueToReview}
            className="rounded-full shadow-btn-primary"
            icon={FiArrowRight}
            iconPosition="right"
          >
            Continue
          </Button>

        </div>

      </div>
  );
}