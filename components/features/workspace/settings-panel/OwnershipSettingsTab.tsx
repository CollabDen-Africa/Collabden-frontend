"use client";

import React, { useState } from "react";
import { FiKey, FiShield, FiAlertTriangle } from "react-icons/fi";
import Avatar from "@/components/ui/Avatar";
import Select from "@/components/ui/Select";

// Mock Collaborators for the dropdown
const COLLABORATORS = [
  "David Chen",
  "Tayo Oni",
  "Michael Awe",
  "Chika Ike"
];

export default function OwnershipSettingsTab() {
  const [selectedCollaborator, setSelectedCollaborator] = useState("");

  return (
    <div className="w-full max-w-[931px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-[40px] lg:rounded-[50px] p-[32px] lg:p-[48px] shadow-2xl animate-in fade-in slide-in-from-right-8 duration-500">
      
      <div className="flex flex-col gap-[40px] w-full max-w-[860px]">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center p-[20px] lg:p-[24px] gap-[16px] bg-black/10 rounded-[30px] border border-white/5 shadow-inner">
          <div className="w-[54px] h-[54px] bg-white/20 rounded-[15px] flex items-center justify-center shrink-0 border border-white/10 shadow-sm">
            <FiKey className="text-white transform -scale-x-100" size={24} />
          </div>
          <div className="flex flex-col justify-center gap-[4px]">
            <h2 className="font-raleway font-semibold text-[22px] lg:text-[25px] leading-[29px] text-white">
              Ownership
            </h2>
            <p className="font-raleway font-medium text-[15px] lg:text-[18px] leading-[21px] text-white/60">
              Transfer full control of Urban Beats Vol. 2 to another collaborator.
            </p>
          </div>
        </div>

        {/* Transfer Ownership Form Section */}
        <div className="flex flex-col gap-[32px] w-full">
          
          {/* Current Owner Display */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[16px] w-full max-w-[851px]">
            <div className="flex flex-col gap-[16px]">
              <span className="font-raleway font-bold text-[18px] text-white">
                Current Owner
              </span>
              
              <div className="flex items-center gap-[12px]">
                <div className="relative">
                  <div className="w-[44px] h-[44px] rounded-full border-[1.5px] border-primary-green overflow-hidden">
                    <Avatar name="Aisha Bello" />
                  </div>
                  {/* Green Status Dot */}
                  <div className="absolute bottom-0 right-0 w-[14px] h-[14px] bg-primary-green rounded-full border-[2px] border-white/20" />
                </div>
                
                <div className="flex items-center gap-[10px]">
                  <span className="font-raleway font-medium text-[15px] text-white">
                    Aisha Bello
                  </span>
                  <div className="px-[8px] py-[2px] border border-white/40 rounded-full flex items-center justify-center">
                    <span className="font-raleway font-medium text-[10px] text-white leading-none">
                      You
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shield/Owner Badge */}
            <div className="w-[36px] h-[36px] rounded-full bg-primary-green/10 border border-primary-green flex items-center justify-center shrink-0">
              <FiShield className="text-white" size={16} />
            </div>
          </div>

          {/* Transfer Selection */}
          <div className="flex flex-col gap-[16px] w-full">
            <div className="flex flex-col gap-[6px]">
              <label className="font-raleway font-bold text-[18px] text-white">
                Transfer ownership to
              </label>
              <span className="font-raleway font-normal text-[15px] text-white/60">
                Select an existing collaborator to become the new owner.
              </span>
            </div>
            
            {/* Custom Select Dropdown */}
            <div className="relative w-full h-[50px]">
              <Select 
                              options={COLLABORATORS}
                              value={selectedCollaborator}
                              onChange={setSelectedCollaborator}
                              placeholder="Choose a collaborator..."
                              variant="glass"
                            />
            </div>
          </div>

        </div>

        {/* Danger Zone / Warning Box */}
        <div className="flex flex-col gap-[24px] w-full max-w-[605px] bg-[#FF0000]/[0.04] border border-[#FF0000]/60 rounded-[30px] p-[24px]">
          
          <div className="flex flex-col gap-[16px]">
            <h3 className="font-raleway font-semibold text-[20px] leading-[22px] text-white">
              This action transfers full project ownership
            </h3>
            <p className="font-raleway font-normal text-[16px] lg:text-[18px] leading-[22px] text-white/60">
              You&apos;ll be downgraded to Admin. The new owner gains full control, including deletion rights. This action cannot be undone without the new owner&apos;s consent.
            </p>
          </div>

          <button 
            type="button"
            className="flex items-center justify-center gap-[8px] bg-[#FC110A] hover:bg-[#FC110A]/80 transition-colors duration-300 rounded-[30px] w-fit px-[24px] py-[10px] shadow-lg"
          >
            <FiAlertTriangle className="text-white" size={18} />
            <span className="font-raleway font-semibold text-[16px] lg:text-[18px] text-white">
              Transfer Ownership
            </span>
          </button>

        </div>

      </div>
    </div>
  );
}