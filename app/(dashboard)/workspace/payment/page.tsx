"use client";
import { useState } from "react";
import PaymentFlowLayout from "@/components/features/workspace/payments/PaymentFlowLayout";

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
import FundEscrowSuccess from "@/components/features/workspace/payments/payment-setup/FundEscrowSuccess";

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
  | "fund_escrow_success"
  | "escrow_terms"
  | "escrow_milestones"
  | "escrow_allocations"
  | "escrow_review"
  | "escrow_approvals"
  | "escrow_funding"
  | "overview"
  | "transactions"
  | "royalty_settings";

export default function PaymentsPage() {
  const [currentStep, setCurrentStep] = useState<PaymentFlowStep>("setup_start");

  // Centralized Navigation Logic
    const handleBack = () => {
      switch (currentStep) {
        case "fund_wallet": setCurrentStep("setup_start"); break;
        case "fund_wallet_success": setCurrentStep("fund_wallet"); break;
        case "fund_escrow": setCurrentStep("fund_wallet_success"); break;
        case "fund_escrow_success": setCurrentStep("fund_escrow"); break;
        case "escrow_terms": setCurrentStep("fund_escrow_success"); break;
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
            return <PaymentSetup onBeginSetup={() => setCurrentStep("fund_wallet")} />;

          //Fund Wallet Steps
          case "fund_wallet":
            return <FundWalletSetup onContinue={() => setCurrentStep("fund_wallet_success")} />;
          case "fund_wallet_success":
            return <FundWalletSuccess onBackToPayments={handleBack} onFundEscrow={() => setCurrentStep("fund_escrow")} />;

          //Fund Escrow Steps
          case "fund_escrow":
            return <FundEscrowSetup onFundEscrow={() => setCurrentStep("fund_escrow_success")} />;
          case "fund_escrow_success":
            return <FundEscrowSuccess onBackToPayments={handleBack} onContinueToTerms={() => setCurrentStep("escrow_terms")} />;
          
          // Escrow Configuration Steps
          case "escrow_terms":
            return <EscrowTermsSetup onContinueToMilestones={() => setCurrentStep("escrow_milestones")} />;
          case "escrow_milestones":
            return <EscrowMilestonesSetup onBack={handleBack} onContinueToAllocations={() => setCurrentStep("escrow_allocations")} />;
          case "escrow_allocations":
            return <EscrowAllocationSetup onBack={handleBack} onContinueToReview={() => setCurrentStep("escrow_review")} />;
          case "escrow_review":
            return <EscrowReviewSetup onBack={handleBack} onContinueToApprovals={() => setCurrentStep("escrow_approvals")} />;
          case "escrow_approvals":
            return <EscrowApprovalsSetup onBack={handleBack} onContinueToFunding={() => setCurrentStep("escrow_funding")} />;
          case "escrow_funding":
            return <EscrowFundingSetup onBack={handleBack} onActivateEscrow={() => setCurrentStep("overview")} />;
    
          // Overview 
          case "overview":
            return <PaymentOverview onFundEscrow={() => setCurrentStep("fund_escrow")} onViewTransactions={() => setCurrentStep("transactions")} onRoyaltySettings={() => setCurrentStep("royalty_settings")} />;
          case "transactions":
            return <TransactionsView onBack={() => setCurrentStep("overview")} />;
          case "royalty_settings":
            return <RoyaltySettingsView onBack={() => setCurrentStep("overview")} />;
          default:
            return <PaymentSetup onBeginSetup={() => setCurrentStep("fund_wallet")} />;
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