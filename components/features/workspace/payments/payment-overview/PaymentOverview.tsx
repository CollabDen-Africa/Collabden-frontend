"use client";
import { FiTrendingUp, FiSettings, FiCreditCard, FiFileText } from "react-icons/fi";
import Button from "@/components/ui/Button";
import BudgetSummary from "./BudgetSummary";
import PayoutProgress from "./PayoutProgress";
import SessionMilestones from "./SessionMilestones";
import CrewAllocations from "./CrewAllocations";
import { useAuth } from "@/context/AuthContext";
import { useWorkspace } from "@/context/WorkspaceContext";
import { usePayment } from "@/hooks/payment/usePayment";
import { useEscrow } from "@/hooks/escrow/useEscrow";


interface PaymentOverviewProps {
  onFundEscrow?: () => void;
  onConfigureTerms?: () => void;
  onViewTransactions?: () => void;
  onRoyaltySettings?: () => void;
}

export default function PaymentOverview({ 
  onFundEscrow, 
  onConfigureTerms,
  onViewTransactions, 
  onRoyaltySettings 
}: PaymentOverviewProps) {

  const { activeProject } = useWorkspace();
  const projectId = activeProject?.id || "";
  const { user } = useAuth();
  const isOwner = Boolean(user?.id && (activeProject?.owner?.id === user.id || activeProject?.ownerId === user.id));
  
  const { useWallet } = usePayment();
  const { data: walletData } = useWallet();
  
  const { useProjectEscrow } = useEscrow();
  const { data: escrowData } = useProjectEscrow(projectId);
  
  const currencySymbol = walletData?.currency === "USD" ? "$" : "₦";
  const walletBalance = walletData?.balance || 0;
    
    // Calculate Escrow Metrics
    const totalBudget = activeProject?.budget ? Number(activeProject.budget) : (escrowData?.totalAmount || 0);
    const securedInEscrow = escrowData?.fundedAmount || 0;
    const paidOut = escrowData?.releasedAmount || 0;
    const remainingInEscrow = securedInEscrow - paidOut;
  
    // Calculate Milestone Stats
    const milestones = escrowData?.milestones || [];
    const sessionsReleased = milestones.filter((m: any) => m.status === "PAYMENT_RELEASED").length;
    const awaitingSignoff = milestones.filter((m: any) => m.status === "AWAITING_REVIEW" || m.status === "SUBMITTED").length;
    const inEscrowLock = milestones.filter((m: any) => m.status === "PENDING" || m.status === "IN_PROGRESS").length;
  
    const overviewData = {
      currencySymbol,
      walletBalance,
      totalBudget,
      securedInEscrow,
      paidOut,
      remainingInEscrow,
      projectName: activeProject?.name || "Untitled Project",
      sessionsReleased,
      awaitingSignoff,
      inEscrowLock
    };

    // If funded >= the budget, point them straight to terms
  const isFullyFunded = totalBudget > 0 && securedInEscrow >= totalBudget;

  
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
            {isOwner && (
            isFullyFunded ? (
              <Button
                variant="primary"
                onClick={onConfigureTerms}
                className="py-2.5 px-5"
                icon={FiFileText}
                iconPosition="left"
              >
                Configure Terms
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={onFundEscrow}
                className="py-2.5 px-5"
                icon={FiCreditCard}
                iconPosition="left"
              >
                Fund Escrow
          </Button>
          )
            )}
            
            <Button 
              variant="ghost"
              onClick={onViewTransactions} 
              className="border border-white/10 hover:bg-white/10 rounded-full py-2.5 px-5"
              icon={FiTrendingUp}
              iconPosition="left"
            >
              Transactions
          </Button>
          {isOwner && (
            <Button 
              variant="ghost"
              onClick={onRoyaltySettings} 
              className="border border-white/10 py-2.5 px-5"
              icon={FiSettings}
              iconPosition="left"
            >
              Royalty Settings
          </Button>
          )}
          </div>
        </div>

        {/* Modular Sections */}
        <BudgetSummary data={overviewData} />
        <PayoutProgress data={overviewData} />
        <SessionMilestones currencySymbol={currencySymbol} milestones={milestones} />
        <CrewAllocations 
          currencySymbol={currencySymbol} 
          allocations={escrowData?.allocations || []} 
          collaborators={activeProject?.collaborators || []} 
        />

      </div>
    </div>
  );
}