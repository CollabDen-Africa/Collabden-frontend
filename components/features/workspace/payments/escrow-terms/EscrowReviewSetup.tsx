"use client";
import { useRef, useState } from "react";
import {
  FiCheck,
  FiArrowLeft,
  FiArrowRight,
  FiFileText,
  FiUsers,
  FiShield,
  FiDollarSign,
  FiCalendar,
  FiMic
} from "react-icons/fi";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import { useAuth } from "@/context/AuthContext";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useEscrow } from "@/hooks/escrow/useEscrow";
import { usePayment } from "@/hooks/payment/usePayment";
import { useAgreements } from "@/hooks/projects/useAgreements";
import VerificationModal from "@/components/features/profile/VerificationModal";


const DEFAULT_RULES = [
  "All collaborators must approve before activation",
  "72-hour window to raise disputes after milestone submission",
  "Funds remain locked until all approval conditions are met",
  "Auto-release triggered 14 days after approval if no disputes"
];

const BG_COLORS = ["bg-primary-green", "bg-primary-blue", "bg-accent-pink", "bg-accent-yellow"];
const GRADIENT_COLORS = [
  "from-primary-green to-primary-green/80", 
  "from-primary-blue to-primary-blue/80", 
  "from-accent-pink to-accent-pink/80", 
  "from-accent-yellow to-accent-yellow/80"
];

export default function EscrowReviewSetup({ 
  onBack, 
  onContinueToApprovals,
  terms = {},
  milestones = {},
  collaborators: _collaborators = {},
  allocations = [],
  approvalRules = DEFAULT_RULES
}: any) {

  const { activeProject } = useWorkspace();
    const projectId = activeProject?.id || "";

    const { user, refreshUser } = useAuth();
    const isVerified = Boolean(user?.identityVerified);
    const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
    const resumeAfterVerifyRef = useRef(false);

    const { useWallet } = usePayment();
    const { data: walletData } = useWallet();
    const currencySymbol = walletData?.currency === "USD" ? "$" : "₦";

    const { useConfigureEscrow } = useEscrow();
  const configureMutation = useConfigureEscrow();

  const { useProjectAgreements } = useAgreements(projectId);
  const { data: apiAgreements = [] } = useProjectAgreements();
  const latestAgreementId = apiAgreements[0]?.id || "";
  
    const totalBudget = activeProject?.budget || 0;
    const collaboratorsCount = activeProject?.collaborators?.length || 0;
    
    // Computed totals 
    const totalMilestonesAmount = milestones.reduce((sum: number, m: any) => sum + (Number(m.amount) || 0), 0);
  
    // Estimate completion based on the furthest milestone date (if available)
    const estCompletion = milestones.length > 0 && milestones[milestones.length - 1]?.dueDate 
      ? new Date(milestones[milestones.length - 1].dueDate).toLocaleDateString("en-US", { month: "short", year: "numeric" }) 
      : "TBD";
  
  const formatCurrency = (amount: number) => `${currencySymbol}${amount.toLocaleString()}`;

  const runConfigureEscrow = async () => {
    if (!latestAgreementId) {
      console.error("No agreement found for this project.");
      return; 
    }
    try {
      await configureMutation.mutateAsync({
        projectId,
        payload: {
          totalAmount: Number(totalMilestonesAmount),
          agreementId: latestAgreementId,
          fundingMethod: terms.fundingMethod || "Funding Per Milestone",
          reviewPeriodDays: parseInt(terms.reviewPeriodDays) || 7,
          fundingDeadline: terms.fundingDeadline ? new Date(terms.fundingDeadline).toISOString() : undefined,
          milestones: milestones.map((m: any) => ({
            title: m.name,
            description: m.description || m.condition || undefined,
            amount: Number(m.amount),
            dueDate: m.dueDate || m.deadline 
                ? new Date(m.dueDate || m.deadline).toISOString() 
                : undefined,
            collaboratorIds: [m.assignedTo].filter(Boolean)
          }))
        }

        // Uses PUT (update) if editing, or POST (configure) if new
        await activeMutation.mutateAsync({ projectId, payload });
        
      });
      onContinueToApprovals?.();
    } catch (error) {
      console.error("Submission failed", error);
    }
  };

   const handleSubmitReview = async () => {
    if (!isVerified) {
      resumeAfterVerifyRef.current = true;
      setIsVerifyModalOpen(true);
      return;
    }
    await runConfigureEscrow();
  };

  const handleVerifySuccess = async () => {
    setIsVerifyModalOpen(false);
    await refreshUser();
    if (resumeAfterVerifyRef.current) {
      resumeAfterVerifyRef.current = false;
      await runConfigureEscrow();
    }
  };
  

  return (
    <div>
        <VerificationModal
          isOpen={isVerifyModalOpen}
          onClose={() => {
            resumeAfterVerifyRef.current = false;
            setIsVerifyModalOpen(false);
          }}
          onSuccess={handleVerifySuccess}
          defaultFirstName={(user as any)?.firstName ?? ""}
          defaultLastName={(user as any)?.lastName ?? ""}
        />

        {/* Section Header */}
        <div className="flex flex-col gap-2 mb-8">
          <h2 className="font-raleway font-extrabold text-[24px] text-white tracking-[-0.6px]">
            Review Escrow Proposal
          </h2>
          <p className="font-raleway font-normal text-[14px] text-text-muted/90">
            Review all funding and payment terms before sharing.
          </p>
        </div>

        {/* Summary Mini Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-6">
          
          <div className="bg-black/15 border border-white/5 rounded-[20px] p-4 flex flex-col gap-3 backdrop-blur-md">
            <div className="w-8 h-8 rounded-[14px] bg-primary-green/10 flex items-center justify-center">
               <FiDollarSign className="text-primary-green" size={16} />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-raleway font-normal text-[12px] text-text-muted/90">Total Budget</span>
              <span className="font-raleway font-bold text-[16px] text-white">{formatCurrency(totalBudget)}</span>
            </div>
          </div>

          <div className="bg-black/15 border border-white/5 rounded-[20px] p-4 flex flex-col gap-3 backdrop-blur-md">
            <div className="w-8 h-8 rounded-[14px] bg-secondary-blue/10 flex items-center justify-center">
              <FiUsers className="text-secondary-blue" size={16} />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-raleway font-normal text-[12px] text-text-muted">Collaborators</span>
              <span className="font-raleway font-bold text-[16px] text-white">{collaboratorsCount} artists</span>
            </div>
          </div>

          <div className="bg-black/15 border border-white/5 rounded-[20px] p-4 flex flex-col gap-3 backdrop-blur-md">
            <div className="w-8 h-8 rounded-[14px] bg-accent-pink/10 flex items-center justify-center">
              <FiMic className="text-accent-pink" size={16} />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-raleway font-normal text-[12px] text-text-muted">Milestones</span>
              <span className="font-raleway font-bold text-[16px] text-white">{milestones.length} stages</span>
            </div>
          </div>

          <div className="bg-black/15 border border-white/5 rounded-[20px] p-4 flex flex-col gap-3 backdrop-blur-md">
            <div className="w-8 h-8 rounded-[14px] bg-accent-yellow/10 flex items-center justify-center">
               <FiCalendar className="text-accent-yellow" size={16} />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-raleway font-normal text-[12px] text-text-muted">Est. Completion</span>
              <span className="font-raleway font-bold text-[16px] text-white">{estCompletion}</span>
            </div>
          </div>

        </div>

        {/* Detailed Breakdown */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 w-full">
          
          {/* Card 1: Escrow Terms */}
          <div className="bg-black/15 border border-white/5 rounded-[30px] p-6 flex flex-col backdrop-blur-md">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-[10px] bg-secondary-blue/15 flex items-center justify-center">
                <FiShield className="text-secondary-blue" size={14} />
              </div>
              <h3 className="font-raleway font-bold text-[14px] text-white">Escrow Terms</h3>
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
                <span className="font-raleway font-normal text-[12px] text-text-muted">Funding Method</span>
                <span className="font-raleway font-semibold text-[12px] text-white">{terms.fundingMethod || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
                <span className="font-raleway font-normal text-[12px] text-text-muted">Funding Deadline</span>
              <span className="font-raleway font-semibold text-[12px] text-white">{terms.fundingDeadline ? new Date(terms.fundingDeadline).toLocaleDateString() : "TBD"}
              </span>
              </div>
              <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
                <span className="font-raleway font-normal text-[12px] text-text-muted">Auto-Release Period</span>
                <span className="font-raleway font-semibold text-[12px] text-white">{terms.reviewPeriodDays || "7"}</span>
              </div>
              <div className="flex justify-between items-center pt-1.5">
                <span className="font-raleway font-normal text-[12px] text-text-muted">Currency</span>
                <span className="font-raleway font-semibold text-[12px] text-white">{terms.currency || "NGN"}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Milestone Breakdown */}
          <div className="bg-black/15 border border-white/5 rounded-[30px] p-6 flex flex-col backdrop-blur-md">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-[10px] bg-primary-green/15 flex items-center justify-center">
                <FiMic className="text-primary-green" size={14} />
              </div>
              <h3 className="font-raleway font-bold text-[14px] text-white">Milestone Breakdown</h3>
            </div>
            
            <div className="flex flex-col gap-3">
              {milestones.length === 0 ? (
                <span className="text-white/50 text-[13px]">No milestones configured.</span>
                  ) : (
                milestones.map((milestone: any, index: number) => {
                const colorClass = BG_COLORS[index % BG_COLORS.length];
                  return (
                    <div key={milestone.id || index} className="flex justify-between items-center pb-2.5 border-b border-white/5">
                    <div className="flex items-center gap-2.5">
                    <div className={`w-2 h-2 rounded-full ${colorClass}`} />
                    <span className="font-raleway font-normal text-[12px] text-text-muted">{milestone.name || `Milestone ${index + 1}`}</span>
                    </div>
                    <span className="font-raleway font-bold text-[12px] text-white">{formatCurrency(milestone.amount)}</span>
                              </div>
                            );
                          })
                        )}
                        <div className="flex justify-between items-center pt-1.5">
                          <span className="font-raleway font-bold text-[12px] text-text-muted">Total</span>
                          <span className="font-raleway font-bold text-[14px] text-primary-green">{formatCurrency(totalMilestonesAmount)}</span>
                        </div>
                      </div>
                    </div>

          {/* Card 3: Collaborator Allocations */}
          <div className="bg-black/15 border border-white/5 rounded-[30px] p-6 flex flex-col backdrop-blur-md">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-[10px] bg-accent-pink/15 flex items-center justify-center">
                <FiUsers className="text-accent-pink" size={14} />
              </div>
              <h3 className="font-raleway font-bold text-[14px] text-white">Collaborator Allocations</h3>
            </div>
            
            <div className="flex flex-col gap-4">
              {allocations.length === 0 ? (
                <span className="text-white/50 text-[13px]">No allocations configured.</span>
              ) : (
               allocations.map((collab: any, index: number) => {
                const gradientClass = GRADIENT_COLORS[index % GRADIENT_COLORS.length];
                  return (
                    <div key={collab.id || index} className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={collab.name} className="w-6 h-6 text-[10px]" />
                    <span className="font-raleway font-normal text-[12px] text-white/70">{collab.name}</span>
                    </div>
                    <span className="font-raleway font-bold text-[12px] text-white">{formatCurrency(collab.amount)}</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full bg-linear-to-r ${gradientClass} rounded-full`} style={{ width: collab.share || "0%" }} />
                    </div>
                 </div>
                );
               })
              )}
            </div>
          </div>

          {/* Card 4: Approval Rules */}
          <div className="bg-black/15 border border-white/5 rounded-[30px] p-6 flex flex-col justify-between backdrop-blur-md">
            <div>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-[10px] bg-accent-yellow/15 flex items-center justify-center">
                  <FiFileText className="text-accent-yellow" size={14} />
                </div>
                <h3 className="font-raleway font-bold text-[14px] text-white">Approval Rules</h3>
              </div>
              
              <ul className="flex flex-col gap-3">
                {approvalRules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <div className="w-3.5 h-3.5 shrink-0 border border-white/30 rounded-full flex items-center justify-center mt-0.75">
                      <FiCheck className="text-text-muted/70" size={8} />
                    </div>
                    <span className="font-raleway font-normal text-[12px] leading-5 text-text-muted">
                      {rule}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full bg-primary-green/10 border border-primary-green/20 rounded-[14px] p-3 mt-4">
              <span className="font-raleway font-semibold text-[12px] text-primary-green">
                All collaborators must approve before escrow activation
              </span>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row gap-5 sm:gap-0 items-center justify-between mt-12 pt-6 border-t border-white/5">
          
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
          <div className="hidden sm:flex items-center gap-[6px]">
            <div className="w-1.75 h-1.75 bg-primary-green rounded-full" />
            <div className="w-1.75 h-1.75 bg-primary-green rounded-full" />
            <div className="w-1.75 h-1.75 bg-primary-green rounded-full" />
            <div className="w-6.75 h-1.75 bg-primary-green rounded-full" />
            <div className="w-1.75 h-1.75 bg-white/10 rounded-full" />
            <div className="w-1.75 h-1.75 bg-white/10 rounded-full" />
          </div>

          <Button 
            variant="primary"
            onClick={handleSubmitReview}
            disabled={configureMutation.isPending}
            className="rounded-full shadow-btn-primary disabled:opacity-50"
            icon={FiArrowRight}
            iconPosition="right"
          >
            {configureMutation.isPending ? "Saving..." : "Continue"}
          </Button>

        </div>

      </div>
  );
}