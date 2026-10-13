"use client";

import React, { useState } from "react";
import { FiX, FiPlusCircle } from "react-icons/fi";
import Button from "@/components/ui/Button";

interface AddFundsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (amt: number) => void;
  isPending?: boolean;
}

export default function AddFundsOverlay({ isOpen, onClose, onAdd, isPending = false }: AddFundsOverlayProps) {
  const [amount, setAmount] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    onAdd(Number(amount));
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-5 animate-in fade-in duration-300">
      <div className="fixed inset-0 bg-[#121A1F]/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative z-10 w-full max-w-100 bg-white/10 border border-white/20 rounded-[40px] p-10 shadow-2xl backdrop-blur-xl flex flex-col items-center animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 w-8 h-8 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors">
          <FiX className="text-white/60" size={16} />
        </button>

        <div className="w-14 h-14 bg-primary-green/20 rounded-full flex items-center justify-center mb-4">
          <FiPlusCircle className="text-primary-green" size={28} />
        </div>

        <h2 className="font-raleway font-semibold text-[20px] text-white mb-2">Add Funds</h2>
        <p className="font-raleway text-[14px] text-white/60 text-center mb-8">Enter the amount you wish to add to your CollabDen wallet.</p>

        <div className="relative w-full mb-8">
          <span className="absolute left-5 top-4 text-white/60 font-raleway text-[20px]">₦</span>
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-black/20 border border-white/10 rounded-[20px] pl-10 pr-5 py-4 text-white font-raleway text-[20px] outline-none focus:border-primary-green transition-colors
            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        <Button 
          onClick={handleSubmit} disabled={!amount || Number(amount) <= 0 || isPending}
          className={`w-full h-14 rounded-full font-raleway font-semibold text-[16px] ${
            !amount || Number(amount) <= 0 ? "bg-white/5 text-white/40 border-transparent" : "bg-primary-green text-white hover:bg-accent-green-success"
          }`}
        >
          {isPending ? "Processing..." : "Continue"}
        </Button>
      </div>
    </div>
  );
}