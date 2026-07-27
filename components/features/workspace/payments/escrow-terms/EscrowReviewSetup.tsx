"use client";
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

interface EscrowTerms {
  fundingMethod: string;
  fundingDeadline: string;
  autoReleasePeriod: string;
  gracePeriod: string;
  currencyName: string;
}

interface ReviewMilestone {
  id: number;
  name: string;
  amount: number;
  colorClass: string;
}

interface ReviewCollaborator {
  id: number;
  name: string;
  amount: number;
  share: string;
  colorClass: string;
}

interface EscrowReviewSetupProps {
  onBack?: () => void;
  onContinueToApprovals?: () => void;
  totalBudget?: number;
  collaboratorsCount?: number;
  estCompletion?: string;
  currencySymbol?: string;
  terms?: EscrowTerms;
  milestones?: ReviewMilestone[];
  collaborators?: ReviewCollaborator[];
  approvalRules?: string[];
}

const DEFAULT_TERMS: EscrowTerms = {
  fundingMethod: "Bank Transfer",
  fundingDeadline: "Feb 1, 2026",
  autoReleasePeriod: "14 days after approval",
  gracePeriod: "72 hours",
  currencyName: "NGN — Nigerian Naira"
};

const DEFAULT_MILESTONES: ReviewMilestone[] = [
  { id: 1, name: "Pre-Production & Planning", amount: 500000, colorClass: "bg-primary-green" },
  { id: 2, name: "Recording Sessions", amount: 1500000, colorClass: "bg-primary-blue" },
  { id: 3, name: "Mixing & Mastering", amount: 2000000, colorClass: "bg-accent-pink" },
  { id: 4, name: "Distribution & Release", amount: 500000, colorClass: "bg-accent-yellow" }
];

const DEFAULT_COLLABORATORS: ReviewCollaborator[] = [
  { id: 1, name: "Oyinda", amount: 800000, share: "16%", colorClass: "from-primary-green to-primary-green/80" },
  { id: 2, name: "Chinedu Okafor", amount: 1200000, share: "24%", colorClass: "from-primary-blue to-primary-blue/80" },
  { id: 3, name: "Amara Nwosu", amount: 600000, share: "12%", colorClass: "from-accent-pink to-accent-pink/80" },
  { id: 4, name: "Tunde Adeyemi", amount: 950000, share: "19%", colorClass: "from-accent-yellow to-accent-yellow/80" }
];

const DEFAULT_RULES = [
  "All 4 collaborators must approve before activation",
  "72-hour window to raise disputes after milestone submission",
  "Funds remain locked until all approval conditions are met",
  "Auto-release triggered 14 days after approval if no disputes"
];

export default function EscrowReviewSetup({ 
  onBack, 
  onContinueToApprovals,
  totalBudget = 5000000,
  collaboratorsCount = 4,
  estCompletion = "Jun 2026",
  currencySymbol = "₦",
  terms = DEFAULT_TERMS,
  milestones = DEFAULT_MILESTONES,
  collaborators = DEFAULT_COLLABORATORS,
  approvalRules = DEFAULT_RULES
}: EscrowReviewSetupProps) {
  
  const formatCurrency = (amount: number) => `${currencySymbol}${amount.toLocaleString()}`;
  const totalMilestonesAmount = milestones.reduce((sum, m) => sum + m.amount, 0);

  return (
    <div>
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
                <span className="font-raleway font-semibold text-[12px] text-white">{terms.fundingMethod}</span>
              </div>
              <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
                <span className="font-raleway font-normal text-[12px] text-text-muted">Funding Deadline</span>
                <span className="font-raleway font-semibold text-[12px] text-white">{terms.fundingDeadline}</span>
              </div>
              <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
                <span className="font-raleway font-normal text-[12px] text-text-muted">Auto-Release Period</span>
                <span className="font-raleway font-semibold text-[12px] text-white">{terms.autoReleasePeriod}</span>
              </div>
              <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
                <span className="font-raleway font-normal text-[12px] text-text-muted">Grace Period</span>
                <span className="font-raleway font-semibold text-[12px] text-white">{terms.gracePeriod}</span>
              </div>
              <div className="flex justify-between items-center pt-1.5">
                <span className="font-raleway font-normal text-[12px] text-text-muted">Currency</span>
                <span className="font-raleway font-semibold text-[12px] text-white">{terms.currencyName}</span>
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
              {milestones.map((milestone) => (
                <div key={milestone.id} className="flex justify-between items-center pb-2.5 border-b border-white/5">
                  <div className="flex items-center gap-[10px]">
                    <div className={`w-2 h-2 rounded-full ${milestone.colorClass}`} />
                    <span className="font-raleway font-normal text-[12px] text-text-muted">{milestone.name}</span>
                  </div>
                  <span className="font-raleway font-bold text-[12px] text-white">{formatCurrency(milestone.amount)}</span>
                </div>
              ))}
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
              {collaborators.map((collab) => (
                <div key={collab.id} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={collab.name} className="w-6 h-6 text-[10px]" />
                      <span className="font-raleway font-normal text-[12px] text-white/70">{collab.name}</span>
                    </div>
                    <span className="font-raleway font-bold text-[12px] text-white">{formatCurrency(collab.amount)}</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-linear-to-r ${collab.colorClass} rounded-full`} 
                      style={{ width: collab.share }}
                    />
                  </div>
                </div>
              ))}
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
            onClick={onContinueToApprovals}
            className="rounded-full shadow-btn-primary"
            icon={FiArrowRight}
            iconPosition="right"
          >
            Continue
          </Button>

        </div>

      </div>
  );
}