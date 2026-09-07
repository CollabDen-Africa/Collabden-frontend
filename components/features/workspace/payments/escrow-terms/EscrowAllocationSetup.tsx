import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Avatar from "@/components/ui/Avatar";

interface CollaboratorAllocation {
  id: number;
  name: string;
  role: string;
  schedule: string;
  amount: string | number;
  share: string;
  shareValue: number;
  colorClass: string;
  textClass: string;
}

interface EscrowAllocationsSetupProps {
  onBack?: () => void;
  onContinueToReview?: () => void;
  totalBudget?: number;
  totalAllocated?: number;
  unallocated?: number;
  currencySymbol?: string;
  collaborators?: CollaboratorAllocation[];
}

const DEFAULT_COLLABORATORS: CollaboratorAllocation[] = [
  {
    id: 1,
    name: "Oyinda",
    role: "Lead Vocalist & Arranger",
    schedule: "Milestones 1 & 2",
    amount: "800,000",
    share: "16%",
    shareValue: 16,
    colorClass: "from-primary-green to-primary-green/80",
    textClass: "text-primary-green",
  },
  {
    id: 2,
    name: "Chinedu Okafor",
    role: "Beat Producer",
    schedule: "Milestones 1, 2 & 3",
    amount: "1,200,000",
    share: "24%",
    shareValue: 24,
    colorClass: "from-primary-blue to-primary-blue/80",
    textClass: "text-primary-blue",
  },
  {
    id: 3,
    name: "Amara Nwosu",
    role: "Session Guitarist",
    schedule: "Milestone 2",
    amount: "600,000",
    share: "12%",
    shareValue: 12,
    colorClass: "from-accent-pink to-accent-pink/80",
    textClass: "text-accent-pink",
  },
  {
    id: 4,
    name: "Tunde Adeyemi",
    role: "Mix & Mastering Engineer",
    schedule: "Milestones 3 & 4",
    amount: "950,000",
    share: "19%",
    shareValue: 19,
    colorClass: "from-accent-yellow to-accent-yellow/80",
    textClass: "text-accent-yellow",
  }
];

export default function EscrowAllocationsSetup({ 
  onBack, 
  onContinueToReview,
  totalBudget = 5000000,
  totalAllocated = 5000000,
  unallocated = 0,
  currencySymbol = "₦",
  collaborators = DEFAULT_COLLABORATORS
}: EscrowAllocationsSetupProps) {
  
  const formatCurrency = (amount: number) => `${currencySymbol}${amount.toLocaleString()}`;

  return (
    <div>
        {/* Section Header */}
        <div className="flex flex-col gap-2 mb-8">
          <h2 className="font-raleway font-extrabold text-[24px] text-white tracking-[-0.6px]">
            Allocate Payments
          </h2>
          <p className="font-raleway font-normal text-[14px] text-text-muted/80">
            Define how project funds will be distributed among collaborators.
          </p>
        </div>

        {/* Budget Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.75 mb-8">
          {/* Total Budget */}
          <div className="bg-black/15 border border-white/5 rounded-[30px] p-5.5 flex flex-col justify-center min-h-35 backdrop-blur-md">
            <span className="font-raleway font-normal text-[10px] text-text-muted uppercase tracking-[1px] mb-2.25">
              Total Budget
            </span>
            <h3 className="font-raleway font-bold text-[22px] text-white">
              {formatCurrency(totalBudget)}
            </h3>
          </div>

          {/* Total Allocated */}
          <div className="bg-black/15 border border-white/5 rounded-[30px] p-5.5 flex flex-col justify-center min-h-35 backdrop-blur-md">
            <span className="font-raleway font-normal text-[10px] text-text-muted uppercase tracking-[1px] mb-2.25">
              Total Allocated
            </span>
            <h3 className="font-raleway font-bold text-[22px] text-primary-green">
              {formatCurrency(totalAllocated)}
            </h3>
          </div>

          {/* Unallocated */}
          <div className="bg-black/15 border border-white/5 rounded-[30px] p-5.5 flex flex-col justify-center min-h-35 backdrop-blur-md">
            <span className="font-raleway font-normal text-[10px] text-text-muted uppercase tracking-[1px] mb-2.25">
              Unallocated
            </span>
            <h3 className="font-raleway font-bold text-[22px] text-text-muted">
              {formatCurrency(unallocated)}
            </h3>
          </div>
        </div>

        {/* Collaborators Allocation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {collaborators.map((collab) => (
            <div key={collab.id} className="bg-black/15 border border-white/5 rounded-[30px] p-5 flex flex-col backdrop-blur-md">
              
              {/* User Info & Schedule */}
              <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <Avatar name={collab.name} className="w-10 h-10 text-[14px]" />
                  <div className="flex flex-col">
                    <h4 className="font-raleway font-bold text-[14px] text-white">
                      {collab.name}
                    </h4>
                    <span className="font-raleway font-normal text-[12px] text-text-muted/90 mt-0.5">
                      {collab.role}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-start sm:items-end text-right mt-3 sm:mt-0">
                  <span className="font-raleway font-normal text-[12px] text-text-muted/80">
                    Schedule
                  </span>
                  <span className="font-raleway font-semibold text-[12px] text-white/60 mt-0.5">
                    {collab.schedule}
                  </span>
                </div>
              </div>

              {/* Amount Input */}
              <div className="mb-3">
                <Input 
                  label={`Allocation Amount (${currencySymbol})`}
                  defaultValue={collab.amount}
                  variant="glass"
                  className="font-normal"
                />
              </div>

              {/* Share Percentage Indicator */}
              <div className="flex flex-col gap-1.5 mt-auto pt-1">
                <div className="flex justify-between items-center w-full">
                  <span className="font-raleway font-normal text-[12px] text-text-muted/80">
                    Share of total budget
                  </span>
                  <span className={`font-raleway font-bold text-[12px] ${collab.textClass}`}>
                    {collab.share}
                  </span>
                </div>
                {/* Custom Progress Bar */}
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden flex">
                  <div 
                    className={`h-full bg-linear-to-r ${collab.colorClass} rounded-full`}
                    style={{ width: collab.share }}
                  />
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-0 justify-between mt-12 pt-6 border-t border-white/5">
          
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
          <div className="hidden sm:flex items-center gap-1.5">
            <div className="w-1.75 h-1.75 bg-primary-green rounded-full" />
            <div className="w-6.75 h-1.75 bg-primary-green rounded-full" />
            <div className="w-1.75 h-1.75 bg-primary-green rounded-full" />
            <div className="w-1.75 h-1.75 bg-white/10 rounded-full" />
            <div className="w-1.75 h-1.75 bg-white/10 rounded-full" />
            <div className="w-1.75 h-1.75 bg-white/10 rounded-full" />
          </div>

          <Button 
            variant="primary"
            onClick={onContinueToReview}
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