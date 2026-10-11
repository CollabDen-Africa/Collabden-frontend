"use client";
import { useState, useEffect, useMemo } from "react";
import { FiArrowLeft, FiSave, FiInfo, FiAlertCircle } from "react-icons/fi";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Input from "@/components/ui/Input";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useRoyalties } from "@/hooks/escrow/useRoyalties";

interface RoyaltySettingsViewProps {
  onBack?: () => void;
}


export default function RoyaltySettingsView({ onBack }: RoyaltySettingsViewProps) {

  const { activeProject } = useWorkspace();
  const projectId = activeProject?.id || ""; 
  const { useProjectRoyalties, useUpdateRoyaltySplits } = useRoyalties();
  const { data: royaltyData, isLoading: isFetching } = useProjectRoyalties(projectId);
  const updateMutation = useUpdateRoyaltySplits();
  const [splits, setSplits] = useState<any[]>([]);
  const [saveError, setSaveError] = useState<string | null>(null); 

  // Initialize splits from activeProject collaborators
  useEffect(() => {
    const collaborators = activeProject?.collaborators || [];
    const existingSplits = royaltyData.splits || [];
    
    const mappedSplits = collaborators.map((c: any) => {
      const savedSplit = existingSplits.find((s: any) => s.userId === c.userId);
      return {
        userId: c.userId,
        name: c.user?.displayName || c.user?.legalName || c.user?.email || "Unknown User",
        role: c.role || "Collaborator",
        share: savedSplit ? Number(savedSplit.royaltyShare) : 0
      }
    })

      setSplits(mappedSplits);
    }, [activeProject?.collaborators, royaltyData?.splits]);

  const handleShareChange = (userId: string, newShare: string) => {
    // Clear any previous save errors as soon as the user starts typing again
    if (saveError) setSaveError(null);
  
    // Prevent negative numbers and NaN
    let numericShare = parseFloat(newShare);
    if (isNaN(numericShare) || numericShare < 0) numericShare = 0;
      
    setSplits(prev => prev.map(s => s.userId === userId ? { ...s, share: numericShare } : s));
    };

  const totalAllocated = useMemo(() => {
    return splits.reduce((sum, current) => sum + (Number(current.share) || 0), 0);
      }, [splits]);
  const unallocated = Math.max(0, 100 - totalAllocated);
  const isOverAllocated = totalAllocated > 100;

  const handleSave = async () => {
    if (isOverAllocated) return;
      setSaveError(null);
      
    try {
        const splitsPayload = splits
          .filter(s => s.share > 0) 
          .map(s => ({
            userId: s.userId,
            royaltyShare: s.share,
            role: s.role
          }));
  
        await updateMutation.mutateAsync({ projectId, splitsData: splitsPayload });
        
        onBack?.();
  } catch (error: any) {
        // Safely capture the standardized error message thrown by our handleApiError wrapper
        setSaveError(error.message || "An unexpected error occurred while saving royalties.");
      }
    };
  
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
                Manage streaming splits and master royalty allocations.
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            onClick={handleSave}
            disabled={updateMutation.isPending || isOverAllocated || isFetching}
            className="w-full sm:w-auto rounded-full px-6 py-3 flex items-center justify-center"
            icon={FiSave}
            iconPosition="left">
              {updateMutation.isPending ? "Saving to Smart Contract..." : "Save Changes"}
          </Button>
        </div>

        {/* Global Error Alert */}
        {saveError && (
          <div className="mb-6 w-full bg-red-500/10 border border-red-500/30 rounded-[20px] p-4 flex items-start gap-3 animate-fade-in">
            <FiAlertCircle className="text-red-400 shrink-0 mt-0.5" size={18} />
            <span className="font-raleway font-medium text-[14px] text-red-200">{saveError}</span>
          </div>
          )}

        <div className="flex flex-col-reverse lg:flex-row gap-6 md:gap-8 w-full">
          
          {/* Main List */}
          <div className="flex-1 bg-black/15 border border-white/5 rounded-3xl md:rounded-[30px] p-5 md:p-8 flex flex-col backdrop-blur-md">
            <h3 className="font-raleway font-bold text-[16px] md:text-[18px] text-white mb-5 md:mb-6">Master Royalties Breakdown</h3>
            
            <div className="flex flex-col gap-4">
            {isFetching ? (
              <div className="text-white/50 py-10 text-center flex items-center justify-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-primary-green animate-spin" />
                  Loading current splits...
              </div>
            ) : splits.length === 0 ? (
                <div className="text-white/50 py-4 text-center">No collaborators found in this project.</div>
              ) : (
                splits.map((collab) => (
                <div key={collab.userId} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 bg-white/5 border border-white/5 rounded-[20px] p-4">
                  
                  <div className="flex items-center gap-3 md:gap-4">
                    <Avatar name={collab.name} className="w-10 h-10 md:w-12 md:h-12 shrink-0" />
                    <div className="flex flex-col">
                      <h4 className="font-raleway font-bold text-[14px] md:text-[16px] text-white">{collab.name}</h4>
                      <span className="font-raleway font-normal text-[12px] md:text-[13px] text-text-muted">{collab.role}</span>
                    </div>
                  </div>

                  <div className="w-full sm:w-35">
                    <Input
                      type="number"  
                      label="Royalty Share (%)"
                      value={collab.share.toString()}
                      onChange={(e) => handleShareChange(collab.userId, e.target.value)}
                      variant="glass"
                      className={`font-bold text-left sm:text-center pr-8 ${isOverAllocated ? 'text-red-400 focus:border-red-500 border-red-500/30' : 'text-white'}`}
                    />
                  </div>

                </div>
                ))
              )}
            </div>
            
            {/* Total Indicator */}
            <div className="mt-6 pt-5 border-t border-white/10 flex justify-between items-center">
              <div className="flex justify-between items-center">
                <span className="font-raleway font-medium text-[13px] md:text-[15px] text-text-muted">Total Allocated Shares</span>
                <span className={`font-raleway font-black text-[18px] md:text-[20px] transition-colors ${isOverAllocated ? 'text-red-500' : 'text-primary-green'}`}>
                  {totalAllocated.toFixed(2)}%
                </span>
              </div>

                {isOverAllocated && (
                <span className="font-raleway text-[12px] text-red-400 text-right animate-fade-in">
                  Total shares cannot exceed 100%. Please adjust allocations.
                </span>
                )}
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
                You currently have <strong className="text-white">{unallocated.toFixed(2)}%</strong> of the master royalties unallocated. Unallocated shares automatically default to the project owner.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}