"use client";
import { FiTrendingUp, FiSettings, FiCreditCard } from "react-icons/fi";
import Button from "@/components/ui/Button";
import BudgetSummary from "./BudgetSummary";
import PayoutProgress from "./PayoutProgress";
import SessionMilestones from "./SessionMilestones";
import CrewAllocations from "./CrewAllocations";


interface PaymentOverviewProps {
  onFundEscrow?: () => void;
  onViewTransactions?: () => void;
  onRoyaltySettings?: () => void;
}

export default function PaymentOverview({ 
  onFundEscrow, 
  onViewTransactions, 
  onRoyaltySettings 
}: PaymentOverviewProps) {
  // Mock Data
  const overviewData = {
    currencySymbol: "₦",
    walletBalance: 850000,
    totalBudget: 5000000,
    securedInEscrow: 4000000,
    paidOut: 2250000,
    remainingInEscrow: 1750000,
    projectName: "Urban Beats Vol. 2",
    sessionsReleased: 3,
    awaitingSignoff: 1,
    inEscrowLock: 1
  };

  return (
    <div className="w-full min-h-screen relative overflow-hidden p-2">
      
      {/* Content Container */}
      <div className="relative z-10 w-full max-w-300 mx-auto flex flex-col">
        
        {/* Page Header Area */}
       <div className="flex flex-col justify-between items-start w-full mb-4 gap-5">
          <p className="font-raleway text-[16px] text-white leading-6">
            Track funding, escrow, milestone releases, and collaborator payouts.
          </p>
          
          <div className="flex flex-wrap w-full xl:w-auto items-center gap-3">
            <Button 
              variant="primary"
              onClick={onFundEscrow} 
              className="py-[10px] px-[20px]"
              icon={FiCreditCard}
              iconPosition="left"
            >
              Fund Escrow
            </Button>
            <Button 
              variant="ghost"
              onClick={onViewTransactions} 
              className="border border-white/10 hover:bg-white/10 rounded-full py-[10px] px-[20px]"
              icon={FiTrendingUp}
              iconPosition="left"
            >
              Transactions
            </Button>
            <Button 
              variant="ghost"
              onClick={onRoyaltySettings} 
              className="border border-white/10 py-[10px] px-[20px]"
              icon={FiSettings}
              iconPosition="left"
            >
              Royalty Settings
            </Button>
          </div>
        </div>

        {/* Modular Sections */}
        <BudgetSummary data={overviewData} />
        <PayoutProgress data={overviewData} />
        <SessionMilestones currencySymbol={overviewData.currencySymbol} />
        <CrewAllocations currencySymbol={overviewData.currencySymbol} />

      </div>
    </div>
  );
}