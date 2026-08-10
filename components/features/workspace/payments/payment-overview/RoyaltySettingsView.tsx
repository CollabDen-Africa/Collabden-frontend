"use client";
import { FiArrowLeft, FiSave, FiInfo } from "react-icons/fi";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Input from "@/components/ui/Input";

interface RoyaltySettingsViewProps {
  onBack?: () => void;
}

const SPLITS = [
  { id: 1, name: "Samuel Okeke", role: "Lead Vocalist & Arranger", currentShare: 16 },
  { id: 2, name: "Chinedu Okafor", role: "Beat Producer", currentShare: 24 },
  { id: 3, name: "Amara Nwosu", role: "Session Guitarist", currentShare: 12 },
  { id: 4, name: "Tunde Adeyemi", role: "Mix & Mastering Engineer", currentShare: 19 },
];

export default function RoyaltySettingsView({ onBack }: RoyaltySettingsViewProps) {
  return (
    <div className="w-full min-h-screen relative overflow-x-hidden p-5 flex flex-col">

      <div className="relative z-10 w-full max-w-287.5 mx-auto flex flex-col h-full">
        
        {/* Header Area */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 sm:gap-0 mb-8 md:mb-10">
          <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6">
            <Button 
              variant="ghost" 
              onClick={onBack} 
              className="w-auto h-10 p-0 flex items-center justify-center border border-white/2 hover:border-white/10 shrink-0"
            >
              <FiArrowLeft size={20} className="text-white" />
            </Button>
            <div className="flex flex-col gap-1">
              <h1 className="font-raleway font-black text-[20px] md:text-[24px] text-white tracking-[-0.6px]">
                Royalty Settings
              </h1>
              <p className="font-raleway font-normal text-[13px] md:text-[14px] text-white/60">
                Manage backend streaming splits and master royalty allocations.
              </p>
            </div>
          </div>

          <Button variant="primary" className="w-full sm:w-auto rounded-full px-[24px] py-[12px] flex items-center justify-center" icon={FiSave} iconPosition="left">
            Save Changes
          </Button>
        </div>

        <div className="flex flex-col-reverse lg:flex-row gap-6 md:gap-8 w-full">
          
          {/* Main List */}
          <div className="flex-1 bg-black/15 border border-white/5 rounded-3xl md:rounded-[30px] p-5 md:p-8 flex flex-col backdrop-blur-md">
            <h3 className="font-raleway font-bold text-[16px] md:text-[18px] text-white mb-5 md:mb-6">Master Royalties Breakdown</h3>
            
            <div className="flex flex-col gap-4">
              {SPLITS.map((collab) => (
                <div key={collab.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 bg-white/5 border border-white/5 rounded-[20px] p-4">
                  
                  <div className="flex items-center gap-3 md:gap-4">
                    <Avatar name={collab.name} className="w-10 h-10 md:w-12 md:h-12 shrink-0" />
                    <div className="flex flex-col">
                      <h4 className="font-raleway font-bold text-[14px] md:text-[16px] text-white">{collab.name}</h4>
                      <span className="font-raleway font-normal text-[12px] md:text-[13px] text-text-muted">{collab.role}</span>
                    </div>
                  </div>

                  <div className="w-full sm:w-35">
                    <Input 
                      label="Royalty Share (%)"
                      defaultValue={collab.currentShare.toString()}
                      variant="glass"
                      className="font-bold text-left sm:text-center"
                    />
                  </div>

                </div>
              ))}
            </div>
            
            {/* Total Indicator */}
            <div className="mt-6 pt-5 border-t border-white/10 flex justify-between items-center">
              <span className="font-raleway font-medium text-[13px] md:text-[15px] text-text-muted">Total Allocated Shares</span>
              <span className="font-raleway font-black text-[18px] md:text-[20px] text-primary-green">71%</span>
            </div>

          </div>

          {/* Info Sidebar */}
          <div className="w-full lg:w-85 shrink-0 flex flex-col gap-4">
            <div className="bg-primary-blue/15 border border-primary-blue/20 rounded-3xl p-5 flex flex-col  backdrop-blur-md">
              <div className="flex gap-2">
              <FiInfo size={20} className="text-secondary-blue mb-3 md:mb-4" />
              <h4 className="font-raleway font-bold text-[14px] md:text-[15px] text-secondary-blue mb-2">
                Smart Contract Integration
                </h4>
              </div>
              <p className="font-raleway font-normal text-[13px] md:text-[14px] text-accent-soft-blue/80 leading-[1.6]">
                Adjusting these values will update the underlying smart contracts used to disburse funds automatically upon DSP streaming payouts. 
              </p>
            </div>
            
            <div className="bg-black/15 border border-white/5 rounded-3xl p-6 flex flex-col backdrop-blur-md">
              <h4 className="font-raleway font-bold text-[13px] md:text-[14px] text-white mb-1.5 md:mb-2">
                Unallocated Shares
              </h4>
              <p className="font-raleway font-normal text-[13px] md:text-[14px] text-text-muted leading-[1.6] mb-3 md:mb-4">
                You currently have <strong className="text-white">29%</strong> of the master royalties unallocated. Unallocated shares automatically default to the project owner.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}