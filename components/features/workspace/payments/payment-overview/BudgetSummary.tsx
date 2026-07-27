"use client";
import { FiArrowDownRight,  FiClock, FiArrowUpLeft } from "react-icons/fi";
import { IoWalletOutline } from "react-icons/io5";

interface BudgetSummaryProps {
  data: {
    currencySymbol: string;
    walletBalance: number;
    totalBudget: number;
    securedInEscrow: number;
    paidOut: number;
    remainingInEscrow: number;
  };
}

export default function BudgetSummary({ data }: BudgetSummaryProps) {
  const formatAmount = (val: number) => `${data.currencySymbol}${val.toLocaleString()}`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 w-full mt-6">
      
      {/* Wallet Balance Card */}
      <div className="bg-primary-blue rounded-[38px] p-4 flex flex-col justify-between h-42.5 relative overflow-hidden sm:justify-center">
        <div className="absolute -top-10 -right-10 w-30 h-30 bg-white/10 rounded-full blur-[2px]" />
        
        <div className="bg-white/10 rounded-full px-2.25 py-1.5 w-max flex items-center gap-1.5 sm:w-full sm:max-w-40 ">
          <IoWalletOutline className="text-white" size={14} />
          <span className="font-raleway font-medium text-[11px] text-white tracking-[0.5px] truncate">Wallet Balance</span>
        </div>
        <div className="mt-5">
          <h3 className="font-raleway font-bold text-[26px] text-white truncate">{formatAmount(data.walletBalance)}</h3>
          <p className="font-raleway font-normal text-[11px] text-white/80 mt-1 truncate">Available for future funding.</p>
        </div>
      </div>

      {/* Total Budget Card */}
      <div className="relative w-full h-42.5 z-10">
               {/* Back Stack Cards */}
               <div className="absolute -top-3 left-3 right-3 h-full bg-primary-green/20 rounded-[38px] -z-20 border border-primary-green/10" />
               <div className="absolute -top-1.5 left-1.5 right-1.5 h-full bg-primary-green/50 rounded-[38px] -z-10 border border-primary-green/20" />
      <div className="bg-primary-green rounded-[38px] p-4 flex flex-col justify-between h-42.5 relative overflow-hidden sm:justify-center">
        <div className="absolute -bottom-10 -left-10 w-30 h-30 bg-white/10 rounded-full blur-[2px]" />
        
        <div className="bg-white/10 rounded-full px-2.25 py-1.5 w-max z-10">
          <span className="font-raleway font-medium text-[11px] text-white tracking-[0.5px]">Total Budget</span>
        </div>
        <div className="mt-5">
          <h3 className="font-raleway font-bold text-[26px] text-white truncate">{formatAmount(data.totalBudget)}</h3>
          <p className="font-raleway font-normal text-[11px] text-white/80 mt-1 truncate">Allocated for this project.</p>
        </div>
        </div>
      </div>

      {/* Secured in Escrow Card */}
      <div className="bg-black/15 border border-white/5 rounded-[38px] p-4 flex flex-col justify-between sm:justify-center h-42.5 relative backdrop-blur-sm">
        <div className="bg-white/10 rounded-full px-2.25 py-1.5 w-max whitespace-nowrap flex items-center gap-1.5 sm:w-full sm:max-w-40">
          <span className="font-raleway font-medium text-[11px] text-white tracking-[0.5px] truncate">Secured in Escrow</span>
           <FiClock className="text-white" size={12} />
        </div>
        <div className="mt-5">
          <h3 className="font-raleway font-bold text-[26px] text-white truncate">{formatAmount(data.securedInEscrow)}</h3>
          <p className="font-raleway font-normal text-[11px] text-text-muted mt-1 truncate">Locked and protected.</p>
        </div>
      </div>

      {/* Paid Out Card */}
      <div className="bg-black/15 border border-white/5 rounded-[38px] p-4 flex flex-col justify-between h-42.5 relative backdrop-blur-sm sm:justify-center overflow-hidden">
        <div className="bg-white/10 rounded-full px-2.25 py-1.5 w-max z-10 flex items-center gap-1.5">
          <span className="font-raleway font-medium text-[11px] text-white tracking-[0.5px] truncate">Paid Out</span>
           <FiArrowDownRight className="text-white" size={12} />
        </div>
        <div className="mt-5">
          <h3 className="font-raleway font-bold text-[26px] text-white truncate">{formatAmount(data.paidOut)}</h3>
          <p className="font-raleway font-normal text-[11px] text-text-muted mt-1 truncate">Released to collaborators.</p>
        </div>
      </div>

      {/* Remaining in Escrow Card */}
      <div className="bg-black/15 border border-white/5 rounded-[38px] p-4 flex flex-col justify-between sm:justify-center h-42.5 relative backdrop-blur-sm truncate overflow-hidden">
        <div className="bg-white/10 rounded-full px-2.25 py-1.5 w-max flex items-center gap-1.5 sm:w-full sm:max-w-40">
          <span className="font-raleway font-medium text-[11px] text-white tracking-[0.5px] truncate">Remaining in Escrow</span>
           <FiArrowUpLeft className="text-white" size={12} />
        </div>
        <div className="mt-5">
          <h3 className="font-raleway font-bold text-[26px] text-white truncate">{formatAmount(data.remainingInEscrow)}</h3>
          <p className="font-raleway font-normal text-[11px] text-text-muted mt-1 truncate">Pending withdrawal.</p>
        </div>
      </div>

    </div>
  );
}