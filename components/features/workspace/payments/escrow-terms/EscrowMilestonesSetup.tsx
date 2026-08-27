"use client";
import { useState } from "react";
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
import DatePicker from "@/components/ui/DatePicker";

interface Milestone {
  id: number;
  colorBg: string;
  colorText: string;
  name: string;
  amount: string | number;
  condition: string;
}

interface EscrowMilestonesSetupProps {
  onBack?: () => void;
  onContinueToAllocations?: () => void;
  milestones?: Milestone[];
  currencySymbol?: string;
}

const DEFAULT_MILESTONES: Milestone[] = [
  { 
    id: 1, 
    colorBg: 'bg-primary-green/15', 
    colorText: 'text-primary-green', 
    name: 'Pre-Production & Planning', 
    amount: '500,000', 
    condition: 'Release when pre-production is approved by all collaborators' 
  },
  { 
    id: 2, 
    colorBg: 'bg-primary-blue/15', 
    colorText: 'text-secondary-blue', 
    name: 'Recording Sessions', 
    amount: '500,000', 
    condition: 'Release when all tracks are recorded and session logged' 
  },
  { 
    id: 3, 
    colorBg: 'bg-accent-pink/15', 
    colorText: 'text-accent-pink', 
    name: 'Mixing & Mastering', 
    amount: '500,000', 
    condition: 'Release when final mix is approved by the project owner' 
  },
  { 
    id: 4, 
    colorBg: 'bg-accent-yellow/15', 
    colorText: 'text-accent-yellow', 
    name: 'Distribution & Release', 
    amount: '500,000', 
    condition: 'Release upon official distribution confirmation.' 
  },
];

export default function EscrowMilestonesSetup({ 
  onBack, 
  onContinueToAllocations,
  milestones = DEFAULT_MILESTONES,
  currencySymbol = "₦"
}: EscrowMilestonesSetupProps) {
  
  // State to handle appending new milestones
   const [activeMilestones, setActiveMilestones] = useState<Milestone[]>(milestones);
  const [dueDates, setDueDates] = useState<Record<number, Date>>({});
  const handleDateSelect = (id: number, date: Date) => {
    setDueDates(prev => ({ ...prev, [id]: date }));
  };

  const handleAddMilestone = () => {
      const nextId = activeMilestones.length > 0 ? Math.max(...activeMilestones.map(m => m.id)) + 1 : 1;
      setActiveMilestones([
        ...activeMilestones,
        {
          id: nextId,
          colorBg: 'bg-white/10',
          colorText: 'text-white',
          name: `Milestone ${nextId}`,
          amount: '',
          condition: ''
        }
      ]);
    };

  const moveMilestone = (index: number, direction: 'up' | 'down') => {
      const newMilestones = [...activeMilestones];
      if (direction === 'up' && index > 0) {
        [newMilestones[index - 1], newMilestones[index]] = [newMilestones[index], newMilestones[index - 1]];
      } else if (direction === 'down' && index < newMilestones.length - 1) {
        [newMilestones[index + 1], newMilestones[index]] = [newMilestones[index], newMilestones[index + 1]];
      }
      
      // Auto-update IDs to maintain correct numbering sequence
      const reordered = newMilestones.map((m, i) => ({ ...m, id: i + 1 }));
      setActiveMilestones(reordered);
       }

  return (
    <div>
        {/* Section Header */}
        <div className="flex flex-col gap-2 mb-8">
          <h2 className="font-raleway font-extrabold text-[12px] text-white tracking-[-0.6px]">
            Configure Payment Milestones
          </h2>
          <p className="font-raleway font-normal text-[14px] text-text-muted/90">
            Break project compensation into measurable product milestones
          </p>
        </div>

        {/* Milestones Container */}
        <div className="w-full bg-black/15 border border-white/5 rounded-[30px] p-8 flex flex-col gap-6 backdrop-blur-md">
          
          {activeMilestones.map((milestone, index) => (
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
                                disabled={index === activeMilestones.length - 1} 
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
                  variant="glass"
                  className="font-normal"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Amount each */}
                  <Input 
                    label={`Amount each (${currencySymbol})`}
                    defaultValue={milestone.amount}
                    variant="glass"
                    className="font-normal"
                  />

                  {/* Due Date */}
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-sm font-semibold block pl-1 text-white">
                      Due Date
                    </label>
                    <DatePicker 
                      selectedDate={dueDates[milestone.id]}
                      onSelect={(date) => handleDateSelect(milestone.id, date)}
                      className="bg-white/10 text-white border-2 border-transparent hover:border-primary-green focus:border-primary-green focus:bg-white/15 rounded-full px-4 font-medium transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Release Condition */}
                  <Input 
                    label="Release Condition"
                    defaultValue={milestone.condition}
                    variant="glass"
                    className="font-normal"
                  />

                  {/* Select Collaborator */}
                  <Input 
                    label="Select Collaborator"
                    placeholder="Search collaborators"
                    variant="glass"
                    className="font-normal pl-11"
                  >
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                  </Input>
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