"use client";

import { useState, useMemo } from "react";
import {
  FiCheck,
  FiArrowLeft,
  FiShield,
  FiDollarSign,
  FiCalendar,
  FiMic,
  FiEdit3
} from "react-icons/fi";
import Button from "@/components/ui/Button";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useEscrow } from "@/hooks/escrow/useEscrow";
import { usePayment } from "@/hooks/payment/usePayment";
import { useAuth } from "@/context/AuthContext";

interface CollaboratorEscrowReviewProps {
  onApproved?: () => void;
  onBack?: () => void;
}

const BG_COLORS = ["bg-primary-green", "bg-primary-blue", "bg-accent-pink", "bg-accent-yellow"];

export default function CollaboratorEscrowReview({
  onApproved,
  onBack
}: CollaboratorEscrowReviewProps) {
  const { activeProject } = useWorkspace();
  const { user } = useAuth();
  const projectId = activeProject?.id || "";

  const { useWallet } = usePayment();
  const { data: walletData } = useWallet();
  const currencySymbol = walletData?.currency === "USD" ? "$" : "₦";

  // Fetch the configured escrow data
  const { useProjectEscrow, useApproveEscrowProposal } = useEscrow();
  const { data: escrowData, isLoading } = useProjectEscrow(projectId);
  const approveMutation = useApproveEscrowProposal();

  const [isRequestingChanges, setIsRequestingChanges] = useState(false);
  const [changeNote, setChangeNote] = useState("");

  const formatCurrency = (amount: number) => `${currencySymbol}${amount.toLocaleString()}`;

  // Derived Data
  const milestones = escrowData?.milestones || [];
  const totalAmount = escrowData?.totalAmount || 0;
  
  const myAllocation = useMemo(() => {
    if (!escrowData?.allocations || !user?.id) return null;
    return escrowData.allocations.find((a: any) => a.userId === user.id);
  }, [escrowData, user?.id]);

  const estCompletion = milestones.length > 0 && milestones[milestones.length - 1]?.dueDate
    ? new Date(milestones[milestones.length - 1].dueDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "TBD";

  const handleApprove = async () => {
    try {
      await approveMutation.mutateAsync({
        projectId,
        status: "APPROVED"
      });
      onApproved?.();
    } catch (error) {
      console.error("Failed to approve escrow:", error);
    }
  };

  const handleRequestChanges = async () => {
    if (!changeNote.trim()) return;
    try {
      await approveMutation.mutateAsync({
        projectId,
        status: "CHANGES_REQUESTED",
        comment: changeNote
      });
      setIsRequestingChanges(false);
      setChangeNote("");
      // Optionally trigger a success state or redirect
    } catch (error) {
      console.error("Failed to request changes:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-white/20 border-t-primary-green rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[900px] mx-auto">
      {/* Section Header */}
      <div className="flex flex-col gap-2 mb-8">
        <h2 className="font-raleway font-extrabold text-[24px] text-white tracking-[-0.6px]">
          Review Escrow Terms
        </h2>
        <p className="font-raleway font-normal text-[14px] text-text-muted/90">
          Please review the project funding schedule and your payout allocation. Your approval is required to activate the escrow.
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
            <span className="font-raleway font-bold text-[16px] text-white">{formatCurrency(totalAmount)}</span>
          </div>
        </div>
        
        <div className="bg-black/15 border border-white/5 rounded-[20px] p-4 flex flex-col gap-3 backdrop-blur-md">
          <div className="w-8 h-8 rounded-[14px] bg-secondary-blue/10 flex items-center justify-center">
            <FiDollarSign className="text-secondary-blue" size={16} />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-raleway font-normal text-[12px] text-text-muted">My Payout</span>
            <span className="font-raleway font-bold text-[16px] text-white">
              {myAllocation ? formatCurrency(myAllocation.totalAmount) : "N/A"}
            </span>
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
            <h3 className="font-raleway font-bold text-[14px] text-white">Escrow Rules</h3>
          </div>
          
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
              <span className="font-raleway font-normal text-[12px] text-text-muted">Funding Deadline</span>
              <span className="font-raleway font-semibold text-[12px] text-white">
                {escrowData?.fundingDeadline ? new Date(escrowData.fundingDeadline).toLocaleDateString() : "TBD"}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
              <span className="font-raleway font-normal text-[12px] text-text-muted">Auto-Release Period</span>
              <span className="font-raleway font-semibold text-[12px] text-white">{escrowData?.reviewPeriodDays || "7"} Days</span>
            </div>
            <div className="flex justify-between items-center pt-1.5">
              <span className="font-raleway font-normal text-[12px] text-text-muted">Currency</span>
              <span className="font-raleway font-semibold text-[12px] text-white">{walletData?.currency || "NGN"}</span>
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
                const isAssignedToMe = milestone.collaboratorIds?.includes(user?.id);
                return (
                  <div key={milestone.id || index} className="flex justify-between items-center pb-2.5 border-b border-white/5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-2 h-2 rounded-full ${colorClass}`} />
                        <span className="font-raleway font-normal text-[12px] text-text-muted">
                          {milestone.title || `Milestone ${index + 1}`}
                        </span>
                      </div>
                      {isAssignedToMe && (
                        <span className="font-raleway font-semibold text-[10px] text-primary-green ml-4.5">
                          Assigned to you
                        </span>
                      )}
                    </div>
                    <span className="font-raleway font-bold text-[12px] text-white">{formatCurrency(milestone.amount)}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Action Area */}
      <div className="mt-8 pt-8 border-t border-white/5">
        {isRequestingChanges ? (
          <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 bg-black/15 border border-white/5 p-6 rounded-[24px]">
            <h4 className="font-raleway font-bold text-[14px] text-white mb-2">Request Revisions</h4>
            <textarea
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-[13px] text-white placeholder:text-white/30 outline-none focus:border-white/20 transition-colors resize-none h-24"
              placeholder="Explain what needs to be changed regarding your milestones or payout..."
              value={changeNote}
              onChange={(e) => setChangeNote(e.target.value)}
            />
            <div className="flex justify-end gap-3 mt-2">
              <Button
                variant="ghost"
                onClick={() => setIsRequestingChanges(false)}
                className="px-6 rounded-full border border-white/10 hover:bg-white/5"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleRequestChanges}
                disabled={!changeNote.trim() || approveMutation.isPending}
                className="px-6 rounded-full shadow-btn-primary disabled:opacity-50"
              >
                {approveMutation.isPending ? "Sending..." : "Send Request"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-0">
            {onBack && (
              <Button
                variant="ghost"
                onClick={onBack}
                className="opacity-50 hover:opacity-100 hover:bg-white/10 w-full sm:w-auto"
                icon={FiArrowLeft}
                iconPosition="left"
              >
                Back
              </Button>
            )}
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto ml-auto">
              <button
                onClick={() => setIsRequestingChanges(true)}
                className="flex items-center justify-center gap-2 h-11 px-6 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors w-full sm:w-auto"
              >
                <FiEdit3 size={14} className="text-white/50" />
                <span className="font-raleway font-bold text-[13px] text-white/70">Request Changes</span>
              </button>
              
              <Button
                variant="primary"
                onClick={handleApprove}
                disabled={approveMutation.isPending}
                className="h-11 px-8 rounded-full shadow-btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <FiCheck size={16} />
                <span className="font-raleway font-bold text-[14px]">
                  {approveMutation.isPending ? "Approving..." : "Approve Terms"}
                </span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}