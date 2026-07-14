"use client";

import React from "react";

interface ToggleProps {
  active: boolean;
  onChange: () => void;
  disabled?: boolean;
  className?: string;
}

export default function Toggle({ 
  active, 
  onChange, 
  disabled = false, 
  className = "" 
}: ToggleProps) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={`w-[58.6px] h-[32.2px] rounded-full flex items-center px-0.75 transition-colors duration-300 shrink-0 ${
        active ? "bg-primary-green" : "bg-white/20"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`}
    >
      <div
        className={`w-[23.4px] h-[23.4px] bg-white rounded-full shadow-sm transition-transform duration-300 ${
          active ? "translate-x-7.25" : "translate-x-0"
        }`}
      />
    </button>
  );
}