"use client";
import React from "react";
import { FiInfo } from "react-icons/fi";

interface InfoTooltipProps {
  text: string;
  className?: string;
}

export default function InfoTooltip({ text, className = "" }: InfoTooltipProps) {
  return (
    <div className={`relative group inline-flex items-center justify-center ${className}`}>
      <FiInfo className="text-white/40 hover:text-white transition-colors cursor-pointer" size={14} />
      
      {/* Tooltip Popup */}
      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max max-w-[200px] sm:max-w-[250px] bg-black/95 border border-white/10 text-white/90 text-[12px] leading-relaxed p-3 rounded-[12px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[999] shadow-2xl pointer-events-none text-center">
        {text}
        {/* Down Arrow */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-white/10" />
        <div className="absolute top-[calc(100%-1px)] left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-black/95" />
      </div>
    </div>
  );
}