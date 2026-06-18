"use client";

import React, { useState } from "react";
import { FiX, FiPlusCircle } from "react-icons/fi";
import Button from "@/components/ui/Button";

export default function AddFundsOverlay({ isOpen, onClose, onAdd }: { isOpen: boolean, onClose: () => void, onAdd: (amt: number) => void }) {
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onAdd(Number(amount));
      setIsSubmitting(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-[20px] animate-in fade-in duration-300">
      <div className="fixed inset-0 bg-[#121A1F]/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative z-10 w-full max-w-[400px] bg-white/10 border border-white/20 rounded-[40px] p-[40px] shadow-2xl backdrop-blur-xl flex flex-col items-center animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-[24px] right-[24px] w-[32px] h-[32px] bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors">
          <FiX className="text-white/60" size={16} />
        </button>

        <div className="w-[56px] h-[56px] bg-primary-green/20 rounded-full flex items-center justify-center mb-[16px]">
          <FiPlusCircle className="text-primary-green" size={28} />
        </div>

        <h2 className="font-raleway font-semibold text-[20px] text-white mb-[8px]">Add Funds</h2>
        <p className="font-raleway text-[14px] text-white/60 text-center mb-[32px]">Enter the amount you wish to add to your CollabDen wallet.</p>

        <div className="relative w-full mb-[32px]">
          <span className="absolute left-[20px] top-[16px] text-white/60 font-raleway text-[20px]">$</span>
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-black/20 border border-white/10 rounded-[20px] pl-[40px] pr-[20px] py-[16px] text-white font-raleway text-[20px] outline-none focus:border-primary-green transition-colors
            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        <Button 
          onClick={handleSubmit} disabled={!amount || Number(amount) <= 0 || isSubmitting}
          className={`w-full h-[56px] rounded-full font-raleway font-semibold text-[16px] ${
            !amount || Number(amount) <= 0 ? "bg-white/5 text-white/40 border-transparent" : "bg-primary-green text-white hover:bg-accent-green-success"
          }`}
        >
          {isSubmitting ? "Processing..." : "Continue"}
        </Button>
      </div>
    </div>
  );
}