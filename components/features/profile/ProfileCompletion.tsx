"use client";
import { FiEdit3 } from "react-icons/fi";

interface ProfileCompletionProps {
  percentage?: number;
  suggestion?: string;
}

export default function ProfileCompletion({
  percentage = 92, 
    suggestion = "Add portfolio links to reach 100%" 
  }: ProfileCompletionProps) {
    
    // Math for the Circular Progress Ring
  const radius = 20.11;
  const strokeWidth = 7.79;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="w-full h-20.5 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between px-5 backdrop-blur-md">
      <div className="flex items-center gap-4">
        {/* Circular Progress Ring */}
        <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    
                    {/* Background Track */}
                    <circle
                      cx="24"
                      cy="24"
                      r={radius}
                      stroke="white"
                      strokeOpacity="0.2"
                      strokeWidth={strokeWidth}
                      fill="transparent"
                    />
                    
                    {/* Active Progress Track */}
                    <circle
                      cx="24"
                      cy="24"
                      r={radius}
                      stroke="#73BF44"
                      strokeWidth={strokeWidth}
                      fill="transparent"
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                    />
                    
                  </svg>
                </div>
        
                {/* Dynamic Text */}
                <div className="flex flex-col gap-0.5">
                  <span className="font-raleway font-semibold text-[14px] text-white">
                    Profile Completion — {percentage}%
                  </span>
                  <span className="font-sans font-medium text-[12px] text-white/50">
                    {suggestion}
                  </span>
        </div>
      </div>
      <button className="flex items-center gap-1 bg-primary-green/20 hover:bg-primary-green/30 transition-colors rounded-full px-3 py-1 border border-primary-green/50">
        <FiEdit3 className="text-primary-green" size={12} />
        <span className="font-semibold text-[12px] text-primary-green">Edit</span>
      </button>
    </div>
  );
}