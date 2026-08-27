"use client";
import { FiCheck, FiArrowRight } from "react-icons/fi";
import Button from "@/components/ui/Button";

interface FundEscrowSuccessProps {
  onBackToPayments?: () => void;
  onContinueToTerms?: () => void;
  // Dynamic props
  amountSecured?: number;
  walletBalance?: number;
  escrowReference?: string;
  currencySymbol?: string;
}

export default function FundEscrowSuccess({ 
  onBackToPayments, 
  onContinueToTerms,
  amountSecured = 5075000,
  walletBalance = 850000,
  escrowReference = "ESC-MTYMMMER",
  currencySymbol = "₦"
}: FundEscrowSuccessProps) {
  
  const formatCurrency = (amount: number) => `${currencySymbol}${amount.toLocaleString()}`;

  return (
    <div>
        {/* Success Container */}
        <div className="w-full bg-white/5 border border-white/5 rounded-[40px] flex flex-col items-center justify-center py-20 px-6 backdrop-blur-md relative min-h-165">
          
          {/* Animated Success Icon with Rings */}
          <div className="relative flex items-center justify-center w-20 h-20 mb-10">
            {/* Outer Ring */}
            <div className="absolute w-65.75 h-65.75 rounded-full border-2 border-primary-green/10 opacity-20 pointer-events-none" />
            {/* Inner Ring */}
            <div className="absolute w-28 h-28 rounded-full border-[1.1px] border-primary-green/20 pointer-events-none" />
            
            {/* Core Icon Box */}
            <div className="relative z-10 w-20 h-20 bg-primary-green/10 border-[1.1px] border-primary-green/25 shadow-[0_0_40px_rgba(115,191,68,0.18)] rounded-full flex items-center justify-center">
              <FiCheck size={36} className="text-primary-green" strokeWidth={3} />
            </div>
          </div>

          {/* Success Messaging */}
          <div className="flex flex-col items-center gap-4 mb-12 text-center">
            <span className="font-raleway font-bold text-[10px] text-primary-green/70 uppercase tracking-[1px]">
              Escrow Successfully Funded
            </span>
            <h2 className="font-raleway font-bold text-[24px] text-primary-green leading-5">
              {formatCurrency(amountSecured)} secured in escrow
            </h2>
            <p className="font-raleway font-normal text-[14px] text-text-muted max-w-90">
              Your project funds have been safely moved to the project escrow
            </p>
          </div>

          {/* Escrow Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl mb-12">
            
            {/* Card 1: Amount Secured */}
            <div className="bg-black/15 border border-white/5 rounded-4xl p-6 flex flex-col justify-center min-h-30 md:min-h-37 gap-1">
              <span className="font-raleway font-bold text-[14px] text-white">Amount Secured</span>
              <span className="font-raleway font-normal text-[14px] text-white/70">{formatCurrency(amountSecured)}</span>
            </div>

            {/* Card 2: Escrow Status */}
            <div className="bg-black/15 border border-white/5 rounded-4xl p-6 flex flex-col justify-center min-h-30 md:min-h-37 gap-[4px]">
              <span className="font-raleway font-bold text-[14px] text-white">Escrow Status</span>
              <span className="font-raleway font-normal text-[14px] text-primary-green">Active - Awaiting terms</span>
            </div>

            {/* Card 3: Remaining Balance */}
            <div className="bg-black/15 border border-white/5 rounded-4xl p-6 flex flex-col justify-center min-h-30 md:min-h-37 gap-1">
              <span className="font-raleway font-bold text-[14px] text-white">Remaining Wallet Balance</span>
              <span className="font-raleway font-normal text-[14px] text-secondary-blue">{formatCurrency(walletBalance)}</span>
            </div>

            {/* Card 4: Reference */}
            <div className="bg-black/15 border border-white/5 rounded-4xl p-6 flex flex-col justify-center min-h-30 md:min-h-37 gap-1">
              <span className="font-raleway font-bold text-[14px] text-white">Funding Reference</span>
              <span className="font-raleway font-normal text-[14px] text-text-muted">{escrowReference}</span>
            </div>

          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                      <Button 
                        variant="ghost"
                        onClick={onBackToPayments}
                        className="w-full sm:flex-1 border-[1.1px] border-white/10 hover:bg-white/5 transition-colors rounded-[30px] py-3.5 md:py-3 font-raleway font-semibold text-[13px] md:text-[14px] text-text-muted whitespace-nowrap"
                      >
                        Back to Payments
                      </Button>
                      <Button 
                        variant="primary"
                        onClick={onContinueToTerms}
                        className="w-full sm:flex-[1.8] rounded-[30px] py-3.5 md:py-3 flex items-center justify-center gap-2"
                        icon={FiArrowRight}
                        iconPosition="right"
                      >
                        <span className="font-raleway font-black text-[13px] md:text-[14px] text-white whitespace-nowrap">Continue to escrow terms</span>
                      </Button>
                    </div>

        </div>

      </div>
  );
}