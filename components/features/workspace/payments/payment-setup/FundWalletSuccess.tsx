"use client";
import { FiCheck, FiArrowRight } from "react-icons/fi";
import Button from "@/components/ui/Button";

interface FundWalletSuccessProps {
  onBackToPayments?: () => void;
  onFundEscrow?: () => void;
  // Dynamic data props
  amountAdded?: number;
  updatedBalance?: number;
  transactionRef?: string;
  transactionDate?: string;
  transactionTime?: string;
  paymentMethod?: string;
  currencySymbol?: string;
}


export default function FundWalletSuccess({ 
  onBackToPayments, 
  onFundEscrow,
  amountAdded = 5075000,
  updatedBalance = 5925000,
  transactionRef = "CDDU8S028U",
  transactionDate = "21 July 2026",
  transactionTime = "19:20",
  paymentMethod = "Debit Card · Visa ****8832",
  currencySymbol = "₦"
}: FundWalletSuccessProps) {
  
  const formatCurrency = (amount: number) => `${currencySymbol}${amount.toLocaleString()}`;

  return (
      <div>
        {/* Success Container */}
        <div className="w-full bg-white/5 border border-white/5 rounded-[40px] md:rounded-[100px] flex flex-col items-center justify-center py-10 md:py-20 px-6 backdrop-blur-md relative min-h-165">
          
          {/* Success Icon with Rings */}
          <div className="relative flex items-center justify-center w-20 h-20 mb-8">
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
          <div className="flex flex-col items-center gap-4 mb-10 text-center">
            <span className="font-raleway font-bold text-[10px] text-primary-green/70 uppercase tracking-[1px]">
              Payment Successful
            </span>
            <h2 className="font-raleway font-bold text-[24px] text-primary-green leading-5">
              {formatCurrency(amountAdded)} added to your wallet
            </h2>
            <p className="font-raleway font-normal text-[14px] text-text-muted">
              Your CollabDen Wallet has been topped up successfully
            </p>
          </div>

          {/* Transaction Details Card */}
          <div className="w-full max-w-md bg-black/15 border-[1.1px] border-primary-green/15 rounded-[30px] flex flex-col overflow-hidden mb-6">
            
            {/* Card Header */}
            <div className="bg-primary-green/5 border-b-[1.1px] border-white/5 py-4 px-6 flex justify-between items-center">
              <span className="font-raleway font-bold text-[9px] text-primary-green/70 uppercase tracking-[0.9px]">
                Transaction Confirmed
              </span>
              <div className="bg-primary-green/10 border-[1.1px] border-primary-green/20 rounded-full px-2.5 py-1">
                <span className="font-raleway font-bold text-[10px] text-primary-green">Success</span>
              </div>
            </div>

            {/* Details Rows */}
            <div className="flex flex-col px-6 pb-5">
              <div className="flex justify-between items-center py-5 border-b-[1.1px] border-white/5">
                <span className="font-raleway font-normal text-[12px] text-text-muted">Amount Added</span>
                <span className="font-raleway font-bold text-[14px] text-primary-green">{formatCurrency(amountAdded)}</span>
              </div>
              <div className="flex justify-between items-center py-5 border-b-[1.1px] border-white/5">
                <span className="font-raleway font-normal text-[12px] text-text-muted">Updated Wallet Balance</span>
                <span className="font-raleway font-bold text-[14px] text-primary-green">{formatCurrency(updatedBalance)}</span>
              </div>
              <div className="flex justify-between items-center py-5 border-b-[1.1px] border-white/5">
                <span className="font-raleway font-normal text-[12px] text-text-muted">Transaction Reference</span>
                <span className="font-raleway font-bold text-[14px] text-white">{transactionRef}</span>
              </div>
              <div className="flex justify-between items-center py-5 border-b-[1.1px] border-white/5">
                <span className="font-raleway font-normal text-[12px] text-text-muted">Date</span>
                <span className="font-raleway font-bold text-[14px] text-white">{transactionDate}</span>
              </div>
              <div className="flex justify-between items-center py-5 border-b-[1.1px] border-white/5">
                <span className="font-raleway font-normal text-[12px] text-text-muted">Time</span>
                <span className="font-raleway font-bold text-[14px] text-white">{transactionTime}</span>
              </div>
              <div className="flex justify-between items-center py-5">
                <span className="font-raleway font-normal text-[12px] text-text-muted">Method</span>
                <span className="font-raleway font-bold text-[14px] text-white">{paymentMethod}</span>
              </div>
            </div>

          </div>

          {/* Actions */}
                   <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md mb-20">
                     <Button 
                       variant="ghost"
                       onClick={onBackToPayments}
                       className="w-full sm:flex-1 border-[1.1px] border-white/10 hover:bg-white/5 transition-colors rounded-[30px] py-3.5 md:py-3 font-raleway font-semibold text-[13px] md:text-[14px] text-text-muted whitespace-nowrap"
                     >
                       Back to Payments
                     </Button>
                     <Button 
                       variant="primary"
                       onClick={onFundEscrow}
                       className="w-full sm:flex-[1.8] rounded-[30px] py-3.5 md:py-3 flex items-center justify-center gap-2"
                       icon={FiArrowRight}
                       iconPosition="right"
                     >
                       <span className="font-raleway font-black text-[13px] md:text-[14px] text-white">Fund Project Escrow</span>
                     </Button>
                   </div>


        </div>

      </div>
  );
}