"use client";
import { useState, useEffect, Suspense, useRef, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import paymentService from "@/services/payment.service";
import PaymentFlowLayout from "@/components/features/workspace/payments/PaymentFlowLayout";
import { useWorkspace } from "@/context/WorkspaceContext";

// Initial Setup & Overview
import PaymentSetup from "@/components/features/workspace/payments/payment-setup/PaymentSetup";
import PaymentOverview from "@/components/features/workspace/payments/payment-overview/PaymentOverview";

// Overview Sub-Views
import TransactionsView from "@/components/features/workspace/payments/payment-overview/TransactionsView";
import RoyaltySettingsView from "@/components/features/workspace/payments/payment-overview/RoyaltySettingsView";

// Wallet & Escrow Funding Flow
import FundWalletSetup from "@/components/features/workspace/payments/payment-setup/FundWalletSetup";
import FundWalletSuccess from "@/components/features/workspace/payments/payment-setup/FundWalletSuccess";
import FundEscrowSetup from "@/components/features/workspace/payments/payment-setup/FundEscrowSetup";

// Escrow Terms & Configuration Flow
import EscrowTermsSetup from "@/components/features/workspace/payments/escrow-terms/EscrowTermsSetup";
import EscrowMilestonesSetup from "@/components/features/workspace/payments/escrow-terms/EscrowMilestonesSetup";
import EscrowAllocationSetup from "@/components/features/workspace/payments/escrow-terms/EscrowAllocationSetup";
import EscrowReviewSetup from "@/components/features/workspace/payments/escrow-terms/EscrowReviewSetup";
import EscrowApprovalsSetup from "@/components/features/workspace/payments/escrow-terms/EscrowApprovalsSetup";
import EscrowFundingSetup from "@/components/features/workspace/payments/escrow-terms/EscrowFundingSetup";

export type PaymentFlowStep = 
  | "setup_start"
  | "fund_wallet"
  | "fund_wallet_success"
  | "fund_escrow"
  | "escrow_terms"
  | "escrow_milestones"
  | "escrow_allocations"
  | "escrow_review"
  | "escrow_approvals"
  | "escrow_funding"
  | "overview"
  | "transactions"
  | "royalty_settings";

  export interface MilestoneData {
    id: number;
    colorBg: string;
    colorText: string;
    name: string;
    amount: string | number;
    condition: string;
    assignedTo: string;
    dueDate: Date | null;
  }

const COLOR_MAP = [
  { bg: "from-primary-green to-primary-green/80", text: "text-primary-green" },
  { bg: "from-primary-blue to-primary-blue/80", text: "text-primary-blue" },
  { bg: "from-accent-pink to-accent-pink/80", text: "text-accent-pink" },
  { bg: "from-accent-yellow to-accent-yellow/80", text: "text-accent-yellow" }
];

function PaymentsWizard() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const queryClient = useQueryClient();
    const { activeProject } = useWorkspace();
    const projectBudget = activeProject?.budget ? Number(activeProject.budget) : 0;
  
    // Read initial state from URL to prevent brief flashing of setup_start
    const statusParam = searchParams.get("status");
    const transactionId = searchParams.get("transaction_id");
    const isSuccessfulRedirect = (statusParam === "successful" || statusParam === "completed") && transactionId;

    const verificationLock = useRef(false);
    
    const [currentStep, setCurrentStep] = useState<PaymentFlowStep>(
      isSuccessfulRedirect ? "fund_wallet_success" : "overview"
    );
  
    // Clean the URL upon successful redirect interception
    useEffect(() => {
      if (isSuccessfulRedirect && !verificationLock.current) {
        verificationLock.current = true; // Lock it instantly
            
      // Move UI to the success screen
      setCurrentStep("fund_wallet_success");
            
      paymentService.verifyFunding(transactionId)
        .then((res) => {
          console.log("Workspace Payment verified!", res);
        })
        .catch((err) => {
          console.error("Workspace payment verification failed:", err);
        })
        .finally(() => {
           queryClient.invalidateQueries({ queryKey: ["payments"] });
        // Clean the URL so it doesn't try to re-verify on page refresh
          router.replace(pathname, { scroll: false });
              });
          }
        }, [isSuccessfulRedirect, transactionId, pathname, router, queryClient]);

    const [escrowTerms, setEscrowTerms] = useState<any>({});
      const [escrowMilestones, setEscrowMilestones] = useState<MilestoneData[]>([
        { 
          id: 1, 
          colorBg: 'bg-primary-green/15', 
          colorText: 'text-primary-green', 
          name: 'Phase 1 Delivery', 
          amount: '', 
          condition: '', 
          assignedTo: '',
          dueDate: null
        }
      ]);

      // Calculate allocations once for all steps
      const computedAllocations = useMemo(() => {
        if (!activeProject?.collaborators) return { list: [], totalAllocated: 0, unallocated: projectBudget };

        const ownerId = activeProject.owner?.id || (activeProject as any).ownerId;

        const eligibleCollaborators = activeProject.collaborators.filter(c => {
          const cUserId = c.user?.id || c.userId;
          return cUserId !== ownerId && c.role !== "OWNER";
            });
            
      const totals = new Map<string, number>();
        let allocated = 0;
            
        escrowMilestones.forEach(m => {
      const amt = Number(m.amount) || 0;
        if (m.assignedTo) {
          allocated += amt;
          totals.set(m.assignedTo, (totals.get(m.assignedTo) || 0) + amt);
          }
        });
      
      const list = eligibleCollaborators.map((c, index) => {
        const amount = totals.get(c.userId) || 0;
        const share = projectBudget > 0 ? (amount / projectBudget) * 100 : 0;
        const colorStyle = COLOR_MAP[index % COLOR_MAP.length];
        return {
          id: c.userId,
          name: c.user?.displayName || c.user?.legalName || c.user?.email?.split('@')[0] || "Unknown User",
          role: c.role || "Collaborator",
          amount,
          share: `${share.toFixed(1)}%`,
          colorClass: colorStyle.bg,
          textClass: colorStyle.text
        };
      }).sort((a, b) => b.amount - a.amount);
      
        return {
              list,
              totalAllocated: allocated,
              unallocated: Math.max(0, projectBudget - allocated)
            };
          }, [escrowMilestones, activeProject, projectBudget]);

  // Centralized Navigation Logic
    const handleBack = () => {
      switch (currentStep) {
        case "fund_wallet": setCurrentStep("setup_start"); break;
        case "fund_wallet_success": setCurrentStep("fund_wallet"); break;
        case "fund_escrow": setCurrentStep("setup_start"); break;
        case "escrow_terms": setCurrentStep("fund_escrow"); break;
        case "escrow_milestones": setCurrentStep("escrow_terms"); break;
        case "escrow_allocations": setCurrentStep("escrow_milestones"); break;
        case "escrow_review": setCurrentStep("escrow_allocations"); break;
        case "escrow_approvals": setCurrentStep("escrow_review"); break;
        case "escrow_funding": setCurrentStep("escrow_approvals"); break;
        default: break;
      }
    };

    const renderStepContent = () => {
      switch (currentStep) {
          //Initial Steps
          case "setup_start":
          return <PaymentSetup
            onContinueToWallet={() => setCurrentStep("fund_wallet")} 
            onContinueToEscrowConfig={() => setCurrentStep("fund_escrow")} />;

          //Fund Wallet Steps
          case "fund_wallet":
            return <FundWalletSetup onContinue={() => setCurrentStep("fund_wallet_success")} />;
          case "fund_wallet_success":
          return <FundWalletSuccess
            onBackToPayments={handleBack}
            onContinueToEscrowConfig={() => setCurrentStep("fund_escrow")} />;

          //Fund Escrow Steps
          case "fund_escrow":
            return <FundEscrowSetup onContinueToTerms={() => setCurrentStep("escrow_terms")} />;
          
          // Escrow Configuration Steps
          case "escrow_terms":
          return (
            <EscrowTermsSetup
              terms={escrowTerms}
              onUpdateTerms={setEscrowTerms}
              onContinueToMilestones={() => setCurrentStep("escrow_milestones")} />
            );
          case "escrow_milestones":
          return (
            <EscrowMilestonesSetup
              milestones={escrowMilestones}
              onUpdateMilestones={setEscrowMilestones}
              onBack={handleBack} onContinueToAllocations={() => setCurrentStep("escrow_allocations")} />
            );
          case "escrow_allocations":
          return (
            <EscrowAllocationSetup
              allocations={computedAllocations} 
              totalBudget={projectBudget}
              onBack={handleBack} onContinueToReview={() => setCurrentStep("escrow_review")} />
            );
          case "escrow_review":
          return (
            <EscrowReviewSetup
              terms={escrowTerms}
              milestones={escrowMilestones}
              allocations={computedAllocations.list}
              onBack={handleBack} onContinueToApprovals={() => setCurrentStep("escrow_approvals")} />
            );
          case "escrow_approvals":
            return <EscrowApprovalsSetup onBack={handleBack} onContinueToFunding={() => setCurrentStep("escrow_funding")} onExitToOverview={() => setCurrentStep("overview")} />;
          case "escrow_funding":
            return <EscrowFundingSetup onBack={handleBack} onActivateEscrow={() => setCurrentStep("overview")} />;
    
          // Overview 
          case "overview":
            return <PaymentOverview onFundEscrow={() => setCurrentStep("setup_start")} onConfigureTerms={() => setCurrentStep("escrow_terms")} onViewTransactions={() => setCurrentStep("transactions")} onRoyaltySettings={() => setCurrentStep("royalty_settings")} />;
          case "transactions":
            return <TransactionsView onBack={() => setCurrentStep("overview")} />;
          case "royalty_settings":
            return <RoyaltySettingsView onBack={() => setCurrentStep("overview")} />;
          default:
            return <PaymentSetup
              onContinueToWallet={() => setCurrentStep("fund_wallet")} />;
        }
      };
    
      const isSetupFlow = !["overview", "transactions", "royalty_settings"].includes(currentStep);
      const isEscrowFlow = currentStep.startsWith("escrow_");
      
      // Show lop-level Back button in layout only for initial funding steps
      const showTopBack = isSetupFlow && !isEscrowFlow && currentStep !== "setup_start" && !currentStep.includes("success");

      return (
          <div className="w-full h-full flex items-center justify-center">
            {isSetupFlow ? (
              <PaymentFlowLayout 
                currentStep={currentStep}
                onBack={showTopBack ? handleBack : undefined}
              >
                {renderStepContent()}
              </PaymentFlowLayout>
            ) : (
              renderStepContent()
            )}
          </div>
        );
}

// Wrap in Suspense to safely access URL search params
export default function PaymentsPage() {
  return (
    <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-white/50">Loading Payment Details...</div>}>
      <PaymentsWizard />
    </Suspense>
  );
}