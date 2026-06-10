"use client";

import React, { useState, useEffect } from "react";
import { FiX, FiBriefcase, FiCheck } from "react-icons/fi";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

interface AddEditBankAccountOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any | null; 
}

export default function AddEditBankAccountOverlay({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData 
}: AddEditBankAccountOverlayProps) {
  const [bankName, setBankName] = useState("");
  const [accountType, setAccountType] = useState("Checking");
  const [accountNumber, setAccountNumber] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!initialData;

  // Populate data when opening in Edit Mode
  useEffect(() => {
    if (initialData && isOpen) {
      setBankName(initialData.bankName || "");
      setAccountType(initialData.accountType || "Checking");
      // Simulate grabbing the full account number 
      setAccountNumber(`000000${initialData.accountEnding}` || "");
      setIsPrimary(initialData.isPrimary || false);
    } else if (!isOpen) {
      // Reset form on close
      setBankName("");
      setAccountType("Checking");
      setAccountNumber("");
      setIsPrimary(false);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onSave({ 
        bankName, 
        accountType, 
        accountNumber, 
        isPrimary 
      });
      setIsSubmitting(false);
    }, 1500);
  };

  const isFormValid = bankName.trim() !== "" && accountNumber.length >= 8;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-[20px] animate-in fade-in duration-300">
      
      {/* Darkened & Blurred Backdrop */}
      <div className="fixed inset-0 bg-[#121A1F]/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative z-10 w-full max-w-[500px] bg-white/10 border border-white/20 rounded-[40px] p-[32px] md:p-[40px] shadow-2xl backdrop-blur-xl flex flex-col gap-[24px] animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-[12px]">
            <div className="w-[40px] h-[40px] bg-primary-green/20 rounded-full flex items-center justify-center text-primary-green">
              <FiBriefcase size={20} />
            </div>
            <h2 className="font-raleway font-semibold text-[20px] text-white">
              {isEditMode ? "Edit Bank Account" : "Add Bank Account"}
            </h2>
          </div>
          <button onClick={onClose} className="w-[32px] h-[32px] bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors">
            <FiX className="text-white/60" size={16} />
          </button>
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-[16px] w-full">
          
          <div className="flex flex-col gap-[8px]">
            <label className="font-raleway font-medium text-[14px] text-white/80">Bank Name</label>
            <input 
              value={bankName} 
              onChange={(e) => setBankName(e.target.value)}
              placeholder="e.g. Chase Bank"
              className="w-full h-[52px] bg-black/20 border border-white/10 rounded-[16px] px-[20px] text-white font-raleway outline-none focus:border-primary-green transition-colors"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <Select 
              label="Account Type"
              value={accountType}
              onChange={setAccountType}
              options={["Checking", "Savings", "Business"]}
              variant="glass"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <label className="font-raleway font-medium text-[14px] text-white/80">Account Number</label>
            <input 
              type="number" 
              value={accountNumber} 
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="0000000000"
              className="w-full h-[52px] bg-black/20 border border-white/10 rounded-[16px] px-[20px] text-white font-raleway outline-none focus:border-primary-green transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          {/* Set as Primary Toggle */}
          <label className="flex items-center gap-[12px] mt-[8px] cursor-pointer group w-max">
            <div 
              className={`w-[20px] h-[20px] rounded-[6px] flex items-center justify-center transition-colors border ${
                isPrimary 
                  ? "bg-primary-green border-primary-green" 
                  : "bg-white/10 border-white/20 group-hover:border-white/40"
              }`}
            >
              {isPrimary && <FiCheck className="text-white" size={14} strokeWidth={3} />}
            </div>
            <span className="font-raleway font-medium text-[14px] text-white/80 select-none">
              Set as primary account
            </span>
            <input 
              type="checkbox" 
              className="hidden"
              checked={isPrimary}
              onChange={(e) => setIsPrimary(e.target.checked)}
            />
          </label>

        </div>

        {/* Submit Button */}
        <Button 
          onClick={handleSubmit} 
          disabled={!isFormValid || isSubmitting}
          className={`w-full h-[56px] rounded-full mt-[8px] font-raleway font-semibold text-[16px] transition-all duration-300 ${
            !isFormValid 
              ? "bg-white/5 text-white/40 cursor-not-allowed border-transparent" 
              : "bg-primary-green text-white hover:bg-accent-green-success shadow-[0_4px_14px_rgba(115,191,68,0.3)]"
          }`}
        >
          {isSubmitting ? "Processing..." : isEditMode ? "Save Changes" : "Link Account"}
        </Button>

      </div>
    </div>
  );
}