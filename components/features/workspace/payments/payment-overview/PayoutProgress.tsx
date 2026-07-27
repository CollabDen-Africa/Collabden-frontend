"use client";
import { FiMusic } from "react-icons/fi";

interface PayoutProgressProps {
  data: {
    currencySymbol: string;
    projectName: string;
    paidOut: number;
    totalBudget: number;
    remainingInEscrow: number;
    sessionsReleased: number;
    awaitingSignoff: number;
    inEscrowLock: number;
  };
}

export default function PayoutProgress({ data }: PayoutProgressProps) {
  const formatAmount = (val: number) => `${data.currencySymbol}${val.toLocaleString()}`;
  const progressPercent = data.totalBudget > 0 ? (data.paidOut / data.totalBudget) * 100 : 0;

  return (
    <div className="w-full bg-black/15 border border-white/5 rounded-[50px] p-8 mt-8 flex flex-col gap-8 backdrop-blur-md">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-5 w-full">
        <h2 className="font-raleway font-medium text-[17px] text-white">Project Payout Progress</h2>
        <div className="bg-primary-green/10 border border-primary-green/20 rounded-full px-4 py-1.5 flex items-center gap-2">
          <FiMusic className="text-primary-green" size={14} />
          <span className="font-raleway font-semibold text-[15px] text-primary-green">{data.projectName}</span>
        </div>
      </div>

      {/* Main Stats & Progress Bar */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start  justify-between sm:items-end w-full">
          <div className="flex flex-col">
            <span className="font-raleway text-[15px] text-white/60">Released to Collaborators</span>
            <span className="font-raleway font-bold text-[32px] text-primary-green">{formatAmount(data.paidOut)}</span>
          </div>
          <div className="flex flex-col sm:text-right">
            <span className="font-raleway text-[15px] text-white/60">Total Track Budget</span>
            <span className="font-raleway font-bold text-[32px] text-white">{formatAmount(data.totalBudget)}</span>
          </div>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full bg-white/10 rounded-full h-[12px] overflow-hidden">
          <div 
            className="bg-primary-green h-full rounded-full transition-all duration-1000 ease-out" 
            style={{ width: `${progressPercent}%` }} 
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-5 w-full">
          <span className="font-raleway text-[15px] text-white/60">{Math.round(progressPercent)}% paid out</span>
          <span className="font-raleway text-[15px] text-white/60">{formatAmount(data.remainingInEscrow)} remaining in escrow</span>
        </div>
      </div>

      {/* Bottom Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 border-t border-white/5 pt-6">
        <div className="flex flex-col items-center justify-center">
          <span className="font-raleway font-bold text-[26px] text-primary-green">{data.sessionsReleased}</span>
          <span className="font-raleway text-[13px] text-white/60 mt-1">Sessions Released</span>
        </div>
        <div className="flex flex-col items-center justify-center border-l border-white/5">
          <span className="font-raleway font-bold text-[26px] text-secondary-blue">{data.awaitingSignoff}</span>
          <span className="font-raleway text-[13px] text-white/60 mt-1">Awaiting Sign-off</span>
        </div>
        <div className="flex flex-col items-center justify-center border-l border-white/5">
          <span className="font-raleway font-bold text-[26px] text-white">{data.inEscrowLock}</span>
          <span className="font-raleway text-[13px] text-white/60 mt-1">In Escrow Lock</span>
        </div>
      </div>

    </div>
  );
}