"use client";
import {  
  FiUser,
  FiPlus,
  FiArrowLeft,
  FiArrowRight,
  FiChevronUp,
  FiChevronDown
} from "react-icons/fi";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import DatePicker from "@/components/ui/DatePicker";
import { useWorkspace } from "@/context/WorkspaceContext";
import { usePayment } from "@/hooks/payment/usePayment";
import { MilestoneData } from "@/app/(dashboard)/workspace/payment/page";

interface EscrowMilestonesSetupProps {
  milestones: MilestoneData[];
  onUpdateMilestones: (milestones: MilestoneData[]) => void;
  onBack?: () => void;
  onContinueToAllocations?: () => void;
}

export default function EscrowMilestonesSetup({ 
  milestones,
  onUpdateMilestones,
  onBack, 
  onContinueToAllocations 
}: EscrowMilestonesSetupProps) {
  
  const { activeProject } = useWorkspace();
  const { useWallet } = usePayment();
  const { data: walletData } = useWallet();
  const currencySymbol = walletData?.currency === "USD" ? "$" : "₦";

  const ownerId = activeProject?.owner?.id || (activeProject as any)?.ownerId;

  const collaboratorOptions = activeProject?.collaborators?.filter(c => {
        const cUserId = c.user?.id || c.userId;
        return cUserId !== ownerId && c.role !== "OWNER";
      }).map((c) => ({
      label: c.user?.displayName || c.user?.legalName || c.user?.email?.split('0')[0] || "Unknown User",
      value: c.userId,
    })) || [];
  
  // State to handle appending new milestones
  const handleUpdateMilestone = (id: number, field: keyof MilestoneData, value: any) => {
    if (!onUpdateMilestones) return;
    onUpdateMilestones(
    milestones.map(m => m.id === id ? { ...m, [field]: value } : m)
      );
    };
  
  const handleAddMilestone = () => {
    if (!onUpdateMilestones) return;
    const nextId = milestones.length > 0 ? Math.max(...milestones.map(m => m.id)) + 1 : 1;
      onUpdateMilestones([
        ...milestones,
        {
          id: nextId,
          colorBg: 'bg-white/10',
          colorText: 'text-white',
          name: `Milestone ${nextId}`,
          amount: '',
          condition: '',
          assignedTo: '',
          dueDate: null
        }
      ]);
    };

  const moveMilestone = (index: number, direction: 'up' | 'down') => {
    if (!onUpdateMilestones) return;
      const newMilestones = [...milestones];
      if (direction === 'up' && index > 0) {
        [newMilestones[index - 1], newMilestones[index]] = [newMilestones[index], newMilestones[index - 1]];
      } else if (direction === 'down' && index < newMilestones.length - 1) {
        [newMilestones[index + 1], newMilestones[index]] = [newMilestones[index], newMilestones[index + 1]];
      }
      
      // Auto-update IDs to maintain correct numbering sequence
      const reordered = newMilestones.map((m, i) => ({ ...m, id: i + 1 }));
      onUpdateMilestones(reordered);
       }

  const projectBudget = activeProject?.budget ? Number(activeProject.budget) : 0;
  const totalAssigned = milestones.reduce((sum, m) => sum + (Number(m.amount) || 0), 0);
  const remainingBudget = projectBudget - totalAssigned;

  return (
    <div>
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
        <div className="flex flex-col gap-2 mb-8">
          <h2 className="font-raleway font-extrabold text-[12px] text-white tracking-[-0.6px]">
            Configure Payment Milestones
          </h2>
          <p className="font-raleway font-normal text-[14px] text-text-muted/90">
            Break project compensation into measurable product milestones
          </p>
      </div>

      {/* Dynamic Budget Tracker */}
      <div className="bg-black/30 border border-white/10 rounded-2xl p-3 flex flex-col items-end">
        <span className="font-raleway text-[11px] text-white/50 uppercase tracking-[1px]">Remaining Budget</span>
        <span className={`font-raleway font-bold text-[18px] ${remainingBudget >= 0 ? "text-primary-green" : "text-accent-pink"}`}>
            {currencySymbol}{remainingBudget.toLocaleString()}
        </span>
        </div>
            </div>

        {/* Milestones Container */}
        <div className="w-full bg-black/15 border border-white/5 rounded-[30px] p-8 flex flex-col gap-6 backdrop-blur-md">
          
          {milestones.map((milestone, index) => (
            <div key={milestone.id} className="flex flex-col sm:flex-row gap-4 w-full border-b border-white/5 pb-6 last:border-b-0 last:pb-0">
              
              {/* Number/Icon Column with Sorting Buttons */}
              <div className="flex sm:flex-col items-center justify-center pt-0 sm:pt-8 gap-2">
                <button 
                  onClick={() => moveMilestone(index, 'up')} 
                  disabled={index === 0} 
                  className="disabled:opacity-20 hover:text-white text-text-muted transition-colors"
                >
                  <FiChevronUp size={20} />
                </button>
                              
              <div className={`w-8 h-8 rounded-[10px] flex items-center justify-center ${milestone.colorBg}`}>
                <span className={`font-raleway font-bold text-[13px] ${milestone.colorText}`}>
                    {milestone.id}
                </span>
              </div>
                              
              <button 
                onClick={() => moveMilestone(index, 'down')} 
                disabled={index === milestones.length - 1} 
                className="disabled:opacity-20 hover:text-white text-text-muted transition-colors"
              >
                <FiChevronDown size={20} />
              </button>
            </div>

              {/* Form Fields */}
              <div className="flex-1 flex flex-col gap-4">
                
                {/* Milestone Name */}
                <Input 
                  label="Milestone Name"
                  defaultValue={milestone.name}
                  onChange={(e) => handleUpdateMilestone(milestone.id, 'name', e.target.value)}
                  variant="glass"
                  className="font-normal"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Amount each */}
                  <Input 
                    label={`Amount each (${currencySymbol})`}
                    defaultValue={milestone.amount}
                    onChange={(e) => handleUpdateMilestone(milestone.id, 'amount', e.target.value)}
                    variant="glass"
                    className="font-normal"
                  />

                  {/* Due Date */}
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-sm font-semibold block pl-1 text-white">
                      Due Date
                    </label>
                    <DatePicker 
                      selectedDate={milestone.dueDate}
                      onSelect={(date) => handleUpdateMilestone(milestone.id, 'dueDate', date)}
                      className="bg-white/10 text-white border-2 border-transparent hover:border-primary-green focus:border-primary-green focus:bg-white/15 rounded-full px-4 font-medium transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Release Condition */}
                  <Input 
                    label="Release Condition"
                    value={milestone.condition} 
                    onChange={(e) => handleUpdateMilestone(milestone.id, 'condition', e.target.value)}
                    variant="glass"
                    className="font-normal"
                  />

                  {/* Select Collaborator */}
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-sm font-semibold block pl-1 text-white">Assign Collaborator</label>
                    <Select 
                      options={[{ label: "Unassigned", value: "" }, ...collaboratorOptions]} 
                      value={milestone.assignedTo} 
                      onChange={(value) => handleUpdateMilestone(milestone.id, 'assignedTo', value)}
                      variant="glass" 
                                    />
                  </div>
                  
                </div>

              </div>
            </div>
          ))}

          {/* Add Milestone Button */}
          <button 
            onClick={handleAddMilestone}
            className="w-full mt-4 border-[1.1px] border-dashed border-white/15 hover:bg-white/10 hover:border-white/30 transition-all rounded-[30px] py-3.5 flex items-center justify-center gap-2"
          >
            <FiPlus size={16} className="text-white/60" />
            <span className="font-raleway font-semibold text-[14px] text-text-white">Add Milestone</span>
          </button>
          
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-0 mt-12 pt-6 border-t border-white/5">
          
          <Button 
            variant="ghost"
            onClick={onBack}
            className="opacity-50 hover:opacity-100 hover:bg-white/10"
            icon={FiArrowLeft}
            iconPosition="left"
          >
            Back
          </Button>

         

          <Button 
            variant="primary"
            onClick={onContinueToAllocations}
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